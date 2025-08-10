#!/usr/bin/env node

const { spawn } = require('child_process')
const { promises: fs } = require('fs')
const path = require('path')
const http = require('http')

const TEST_PORT = 3001
const TEST_GARDEN_PATH = path.join(__dirname, 'test-gardens', 'garden1')
const CLI_PATH = path.join(__dirname, '..', 'dist', 'index.js')
const GRAPH_FILE_PATH = path.join(TEST_GARDEN_PATH, 'graph.json')
const TARGET_TEST_DIRECTORY = path.join(
  __dirname,
  '..',
  'target',
  'cli-integration-test'
)
const CUSTOM_GRAPH_PATH = path.join(
  __dirname,
  '..',
  'target',
  'cli-integration-test',
  'custom-graph.json'
)

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function checkServerRunning(port, maxAttempts = 10) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}`, resolve)
        req.on('error', reject)
        req.setTimeout(2000, () => {
          req.destroy()
          reject(new Error('Timeout'))
        })
      })
      return true
    } catch (error) {
      if (attempt === maxAttempts) return false
      await sleep(1000)
    }
  }
  return false
}

async function checkGraphFile(filePath = GRAPH_FILE_PATH) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    const graph = JSON.parse(content)
    return {
      exists: true,
      nodeCount: Object.keys(graph.nodes || {}).length,
      linkCount: (graph.links || []).length,
    }
  } catch (error) {
    return { exists: false, error: error.message }
  }
}

async function cleanupGraphFile(filePath = GRAPH_FILE_PATH) {
  try {
    await fs.unlink(filePath)
  } catch (error) {
    // File doesn't exist, that's fine
  }
}

async function makeTargetTestDirectory() {
  await fs.mkdir(TARGET_TEST_DIRECTORY, { recursive: true })
}

async function cleanupAllGraphFiles() {
  await cleanupGraphFile(GRAPH_FILE_PATH)
  await cleanupGraphFile(CUSTOM_GRAPH_PATH)
}

async function runTest(testName, useGraphFlag) {
  console.log(`\n🧪 Running test: ${testName}`)

  // Clean up any existing graph files
  await cleanupAllGraphFiles()

  const args = ['-d', TEST_GARDEN_PATH, '-p', TEST_PORT]
  if (useGraphFlag) {
    args.push('-g')
    args.push('-o', CUSTOM_GRAPH_PATH)
  }

  console.log(`   Starting CLI with args: ${args.join(' ')}`)

  const cliProcess = spawn('node', [CLI_PATH, ...args], {
    stdio: 'pipe',
    env: { ...process.env, NODE_ENV: 'test' },
  })

  let output = ''
  cliProcess.stdout.on('data', data => {
    output += data.toString()
  })

  cliProcess.stderr.on('data', data => {
    output += data.toString()
  })

  try {
    // Wait for server to start
    console.log('   Waiting for server to start...')
    await sleep(3000)

    const serverRunning = await checkServerRunning(TEST_PORT)

    if (!serverRunning) {
      throw new Error('Server failed to start')
    }

    console.log('   ✅ Server is running')

    const graphResult = await checkGraphFile(CUSTOM_GRAPH_PATH)

    if (useGraphFlag) {
      if (!graphResult.exists) {
        throw new Error(
          `Graph file should exist at ${CUSTOM_GRAPH_PATH} when -g flag is used`
        )
      }
      console.log(
        `   ✅ Graph file created at ${CUSTOM_GRAPH_PATH} with ${graphResult.nodeCount} nodes and ${graphResult.linkCount} links`
      )

      if (graphResult.nodeCount === 0) {
        throw new Error('Graph should contain nodes')
      }
    } else {
      if (graphResult.exists) {
        throw new Error('Graph file should not exist when -g flag is not used')
      }
      console.log('   ✅ Graph file correctly not created without -g flag')
    }

    console.log(`   ✅ ${testName} passed`)
    return true
  } catch (error) {
    console.log(`   ❌ ${testName} failed: ${error.message}`)
    console.log('   CLI output:', output)
    return false
  } finally {
    cliProcess.kill('SIGTERM')
    await cleanupAllGraphFiles()
    await sleep(1000) // Give time for cleanup
  }
}

async function main() {
  console.log('🚀 Starting CLI Integration Tests')
  console.log(`   Test garden path: ${TEST_GARDEN_PATH}`)
  console.log(`   CLI path: ${CLI_PATH}`)

  await makeTargetTestDirectory()

  // Check if CLI is built
  try {
    await fs.access(CLI_PATH)
  } catch (error) {
    console.log('❌ CLI not built. Run: npm run build:cli', error)
    process.exit(1)
  }

  let allPassed = true

  // Test without graph generation
  const test1Passed = await runTest('CLI without graph generation', false)
  allPassed = allPassed && test1Passed

  // Test with graph generation
  const test2Passed = await runTest('CLI with graph generation', true)
  allPassed = allPassed && test2Passed

  console.log('\n📊 Test Results:')
  if (allPassed) {
    console.log('✅ All CLI integration tests passed!')
    process.exit(0)
  } else {
    console.log('❌ Some CLI integration tests failed!')
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
