# Garden - Markdown Viewer

A Next.js application that can be run as a command with npx to view markdown files from any directory.

## Installation

```bash
npm install -g @adaptivekind/garden
```

## Usage

Navigate to any directory with markdown files and run:

```bash
garden
```

Or specify a different directory:

```bash
garden -d /path/to/markdown/files
```

Options:

- `-d, --dir <directory>` - Directory to scan for markdown files (default: current directory)
- `-p, --port <port>` - Port to run the server on (default: 3000)

## Features

- Automatically discovers all `.md` files in a directory
- Renders markdown
- Wiki-style linking with `[[page]]` and `[[page|display text]]` syntax
- No configuration required

## Development

```bash
npm install
npm run dev                 # Start Next.js dev server
npm run test:garden        # Start dev server with test garden content
```

**Building:**

```bash
npm run build              # Build both site and CLI
npm run build:site         # Build Next.js site only
npm run build:cli          # Build CLI only
```

**Testing:**

```bash
npm test                   # Run Jest unit tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
npm run test:e2e           # Run Cucumber e2e tests
npm run test:e2e:headed    # Run e2e tests with visible browser
```

**Code Quality:**

```bash
npm run lint               # Next.js linter
npm run typecheck          # TypeScript type checking
npm run prettier           # Check code formatting
npm run lint:fix           # Fix linting and formatting issues
```

**CLI Testing:**

```bash
npm link                   # Link for local testing
garden                     # Run CLI locally
```

## Local testing

Build and link

```sh
npm run build:cli
npm link
```

Then change to a directory of markdown and run `garden`
