#!/usr/bin/env node

import { spawn, ChildProcess } from "node:child_process";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import * as http from "node:http";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_PORT = 3001;
const TEST_GARDEN_PATH = path.join(__dirname, "test-gardens", "garden1");
const CLI_PATH = path.join(__dirname, "..", "dist", "index.js");
const GRAPH_FILE_PATH = path.join(TEST_GARDEN_PATH, "graph.json");
const TARGET_TEST_DIRECTORY = path.join(
  __dirname,
  "..",
  "target",
  "cli-integration-test",
);
const CUSTOM_GRAPH_PATH = path.join(
  __dirname,
  "..",
  "target",
  "cli-integration-test",
  "custom-graph.json",
);

interface GraphResult {
  exists: boolean;
  nodeCount?: number;
  linkCount?: number;
  error?: string;
}

const state = {
  isRunning: true,
};

function isRunning() {
  return state.isRunning;
}

function stop() {
  state.isRunning = false;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkServerRunning(
  port: number,
  maxAttempts: number = 10,
): Promise<boolean> {
  for (let attempt = 1; isRunning() && attempt <= maxAttempts; attempt++) {
    process.stdout.write(".");
    try {
      await new Promise<void>((resolve, reject) => {
        const req = http.get(`http://localhost:${port}`, () => resolve());
        req.on("error", reject);
        req.setTimeout(2000, () => {
          req.destroy();
          reject(new Error("Timeout"));
        });
      });
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (attempt === maxAttempts) return false;
      await sleep(1000);
    }
  }
  return false;
}

async function checkGraphFile(
  filePath: string = GRAPH_FILE_PATH,
): Promise<GraphResult> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const graph = JSON.parse(content);
    return {
      exists: true,
      nodeCount: Object.keys(graph.nodes || {}).length,
      linkCount: (graph.links || []).length,
    };
  } catch (error) {
    return { exists: false, error: (error as Error).message };
  }
}

async function cleanupGraphFile(
  filePath: string = GRAPH_FILE_PATH,
): Promise<void> {
  try {
    await fs.unlink(filePath);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // File doesn't exist, that's fine - silently ignore
  }
}

async function makeTargetTestDirectory(): Promise<void> {
  await fs.mkdir(TARGET_TEST_DIRECTORY, { recursive: true });
}

async function cleanupAllGraphFiles(): Promise<void> {
  await cleanupGraphFile(GRAPH_FILE_PATH);
  await cleanupGraphFile(CUSTOM_GRAPH_PATH);
}

async function runTest(
  testName: string,
  useGraphFlag: boolean,
): Promise<boolean> {
  console.log(`\n🧪 Running test: ${testName}`);

  // Clean up any existing graph files
  await cleanupAllGraphFiles();

  const args = ["-d", TEST_GARDEN_PATH, "-p", TEST_PORT.toString()];
  if (useGraphFlag) {
    args.push("-g");
    args.push("-o", CUSTOM_GRAPH_PATH);
  }

  console.log(`   Starting CLI with args: ${args.join(" ")}`);

  const cliProcess: ChildProcess = spawn("node", [CLI_PATH, ...args], {
    stdio: "pipe",
    env: { ...process.env, NODE_ENV: "test" },
  });
  process.on("SIGINT", () => {
    console.log(`... stopping cli : with graph = ${useGraphFlag}`);
    cliProcess.kill("SIGINT");
  });

  let output = "";
  cliProcess.stdout?.on("data", (data: Buffer) => {
    output += data.toString();
  });

  cliProcess.stderr?.on("data", (data: Buffer) => {
    output += data.toString();
  });

  try {
    // Wait for server to start
    console.log("   Waiting for server to start...");

    const serverRunning = await checkServerRunning(TEST_PORT);

    if (!serverRunning) {
      if (!isRunning()) {
        return false;
      }
      throw new Error("Server failed to start");
    }

    console.log("   ✅ Server is running");

    const graphResult = await checkGraphFile(CUSTOM_GRAPH_PATH);

    if (useGraphFlag) {
      if (!graphResult.exists) {
        throw new Error(
          `Graph file should exist at ${CUSTOM_GRAPH_PATH} when -g flag is used`,
        );
      }
      console.log(
        `   ✅ Graph file created at ${CUSTOM_GRAPH_PATH} with ${graphResult.nodeCount} nodes and ${graphResult.linkCount} links`,
      );

      if ((graphResult.nodeCount || 0) === 0) {
        throw new Error("Graph should contain nodes");
      }
    } else {
      if (graphResult.exists) {
        throw new Error("Graph file should not exist when -g flag is not used");
      }
      console.log("   ✅ Graph file correctly not created without -g flag");
    }

    console.log(`   ✅ ${testName} passed`);
    return true;
  } catch (error) {
    console.log(`   ❌ ${testName} failed: ${(error as Error).message}`);
    console.log("   CLI output:", output);
    return false;
  } finally {
    cliProcess.kill("SIGTERM");
    await cleanupAllGraphFiles();
    await sleep(1000); // Give time for cleanup
  }
}

async function main(): Promise<void> {
  console.log("🚀 Starting CLI Integration Tests");
  console.log(`   Test garden path: ${TEST_GARDEN_PATH}`);
  console.log(`   CLI path: ${CLI_PATH}`);

  await makeTargetTestDirectory();

  // Check if CLI is built
  try {
    await fs.access(CLI_PATH);
  } catch (error) {
    console.log("❌ CLI not built. Run: npm run build:cli", error);
    process.exit(1);
  }

  let allPassed = true;

  // Test without graph generation
  const test1Passed = await runTest("CLI without graph generation", false);
  allPassed = allPassed && test1Passed;

  // Test with graph generation
  const test2Passed =
    isRunning() && (await runTest("CLI with graph generation", true));
  allPassed = allPassed && test2Passed;

  if (isRunning()) {
    console.log("\n📊 Test Results:");
    if (allPassed) {
      console.log("✅ All CLI integration tests passed!");
      process.exit(0);
    } else {
      console.log("❌ Some CLI integration tests failed!");
      process.exit(1);
    }
  }
}

// Handle unhandled promise rejections
process.on(
  "unhandledRejection",
  (reason: unknown, promise: Promise<unknown>) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  },
);

process.on("SIGINT", () => {
  console.log("Stopping tests ...");
  stop();
});

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
