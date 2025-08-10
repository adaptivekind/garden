#!/usr/bin/env node

import { Command } from 'commander'
import { spawn } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
import { createGarden, Garden } from '@adaptivekind/markdown-graph'

const program = new Command()

program
  .name('garden')
  .description('View markdown files in a web browser')
  .version('0.0.1')
  .option('-p, --port <port>', 'port to run the server on', '3000')
  .option(
    '-d, --dir <directory>',
    'directory to scan for markdown files',
    process.cwd()
  )
  .option('-g, --generate-graph', 'generate markdown graph on startup')
  .action(async options => {
    const targetDir = path.resolve(options.dir)
    const port = options.port

    if (!fs.existsSync(targetDir)) {
      console.error(`Directory ${targetDir} does not exist`)
      process.exit(1)
    }

    // Set environment variables for Next.js app
    process.env.MARKDOWN_DIR = targetDir
    process.env.PORT = port

    // Get the path to the Next.js app (relative to this CLI script)
    const appDir = path.join(__dirname, '..')

    console.log(`Starting markdown viewer for directory: ${targetDir}`)
    console.log(`Server will be available at http://localhost:${port}`)

    // Start Next.js development server
    const nextProcess = spawn('npx', ['next', 'dev', '-p', port], {
      cwd: appDir,
      stdio: 'inherit',
      env: { ...process.env },
    })

    // Generate graph after Next.js process has spawned (if requested)
    if (options.generateGraph) {
      try {
        console.log('Generating markdown graph...')
        const garden: Garden = await createGarden({
          type: 'file',
          path: targetDir,
        })
        console.log(
          `Graph generated with ${Object.keys(garden.graph.nodes).length} nodes and ${garden.graph.links.length} links`
        )
      } catch (error) {
        console.error('Failed to generate graph:', error)
      }
    }

    process.on('SIGINT', () => {
      console.log('Closing garden')
      nextProcess.kill('SIGINT')
    })

    process.on('SIGTERM', () => {
      nextProcess.kill('SIGTERM')
    })

    nextProcess.on('error', error => {
      console.error('Failed to start Next.js server:', error)
      process.exit(1)
    })
  })

program.parse()
