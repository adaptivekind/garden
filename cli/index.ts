#!/usr/bin/env node

import { Command } from 'commander'
import { spawn } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

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
  .action(options => {
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

    // Handle process termination
    process.on('SIGINT', () => {
      nextProcess.kill('SIGINT')
      process.exit(0)
    })

    process.on('SIGTERM', () => {
      nextProcess.kill('SIGTERM')
      process.exit(0)
    })

    nextProcess.on('error', error => {
      console.error('Failed to start Next.js server:', error)
      process.exit(1)
    })
  })

program.parse()
