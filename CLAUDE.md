# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Universal Guidance

If the Markdown Reader MCP is available, read `startit.md` for universal guidance to follow for all coding, documentation, communications, planning, designing and work in general.

If the Markdown Reader MCP is NOT available, it can be installed as described at <https://github.com/adaptivekind/markdown-reader-mcp>

## Tone of Voice

- Write in a natural and serious voice
- Do not add humorous anecdotes
- Do not show excessive enthusiasm
- Use English spelling (optimise vs optimize)
- Use normal dashes "-" instead of em dashes "—"

## Project Overview

This is Garden - a Next.js application that serves as a markdown viewer. It can be run as both a CLI tool and a web application to view markdown files from any directory with wiki-style linking support.

**Dual Architecture:**

- **CLI Component** (`cli/index.ts`): Commander-based CLI that spawns a Next.js dev server with environment variables
- **Web Component** (`src/`): Next.js application that renders markdown files using `@adaptivekind/markdown-graph`

**Key Dependencies:**

- `@adaptivekind/markdown-graph`: Core library for markdown processing and graph generation
- `react-markdown`: Markdown rendering
- `commander`: CLI interface
- Wiki-style linking with `[[page]]` syntax

## Development Commands

**Development:**

```bash
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
npm run test:e2e           # Run Cucumber e2e tests (starts server automatically)
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

## Architecture Details

**Page Routing:**

- `[[...name]].tsx`: Dynamic catch-all route that handles both root (`/`) and document paths (`/document-name`)
- Root path looks for `README.md`, other paths match markdown file names
- Uses Next.js static generation with `getStaticPaths` and `getStaticProps`

**Content Processing:**

- `src/lib/garden.ts`: Creates garden instance using `@adaptivekind/markdown-graph`
- `src/lib/markdown.ts`: Processes wiki-style links (`[[page]]` and `[[page|display text]]`)
- `src/lib/config.ts`: Handles `MARKDOWN_DIR` environment variable

**Testing Structure:**

- Unit tests use Jest with React Testing Library
- E2E tests use Cucumber with Playwright
- Test garden content in `test/test-gardens/garden1/`
- E2E tests automatically start/stop server using `start-server-and-test`

## Key Environment Variables

- `MARKDOWN_DIR`: Directory containing markdown files (set by CLI or for development)
- `PORT`: Server port (default: 3000)
- `HEADED`: Set to 'true' for visible browser in e2e tests

## Development Notes

When working with tests, the e2e setup expects content in test garden files. The step definitions look for `<article>` elements for content verification.

The CLI spawns Next.js in development mode, setting `MARKDOWN_DIR` to the target directory, allowing the same codebase to serve different markdown collections.
