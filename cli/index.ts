#!/usr/bin/env node

import { Command } from "commander";
import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";
import {
  createGarden,
  Garden,
  RepositoryOptions,
} from "@adaptivekind/markdown-graph";

process.on("SIGINT", () => {
  console.log("Closing garden");
});

process.on("SIGTERM", () => {
  console.log("Garden CLI - SIGTERM received");
});

const program = new Command();

program
  .name("garden")
  .description("View markdown files in a web browser")
  .version("0.0.1")
  .option("-p, --port <port>", "port to run the server on", "3000")
  .option(
    "-d, --dir <directory>",
    "directory to scan for markdown files",
    process.cwd(),
  )
  .option("-g, --generate-graph", "generate markdown graph on startup")
  .option("-o, --graph-output <file>", "specify output file for graph JSON")
  .action(async (options) => {
    const targetDir = path.resolve(options.dir);
    const port = options.port;

    if (!fs.existsSync(targetDir)) {
      console.error(`Directory ${targetDir} does not exist`);
      process.exit(1);
    }

    // Set environment variables for Next.js app
    process.env.MARKDOWN_DIR = targetDir;
    process.env.PORT = port;

    // Get the path to the Next.js app (relative to this CLI script)
    const appDir = path.join(__dirname, "..");

    // Generate graph after Next.js process has spawned (if requested)
    if (options.generateGraph) {
      try {
        console.log("Generating markdown graph...");
        const gardenOptions: RepositoryOptions = {
          ...{
            type: "file",
            path: targetDir,
          },
          ...(options.graphOutput
            ? { outputPath: path.resolve(options.graphOutput) }
            : {}),
        };

        if (options.graphOutput) {
          console.log(`Graph will be saved to: ${gardenOptions.outputPath}`);
        }

        const garden: Garden = await createGarden(gardenOptions);
        console.log(
          `Graph generated with ${Object.keys(garden.graph.nodes).length} nodes and ${garden.graph.links.length} links`,
        );
        garden.save();
      } catch (error) {
        console.error("Failed to generate graph:", error);
      }
    }

    // Copy .garden-graph.json to public directory if it exists
    const gardenGraphPath = path.join(targetDir, ".garden-graph.json");
    const publicGraphPath = path.join(appDir, "public", "garden.json");

    if (fs.existsSync(gardenGraphPath)) {
      try {
        fs.copyFileSync(gardenGraphPath, publicGraphPath);
        console.log("Copied .garden-graph.json to public directory");
      } catch (error) {
        console.warn("Failed to copy .garden-graph.json:", error);
      }
    }

    console.log(`Starting markdown viewer for directory: ${targetDir}`);
    console.log(`Server will be available at http://localhost:${port}`);

    // Start Next.js development server
    const nextProcess = spawn("npx", ["next", "dev", "-p", port], {
      cwd: appDir,
      stdio: "inherit",
      env: { ...process.env },
    }).on("error", (error) => {
      console.error("Failed to start Next.js server:", error);
      process.exit(1);
    });

    process.on("SIGINT", () => {
      console.log("Stopping next process");
      nextProcess.kill("SIGINT");
    });
  });

program.parse();
