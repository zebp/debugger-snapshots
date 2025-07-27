# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- **Build**: `pnpm build` - Uses tsdown to build the TypeScript source files
- **Test**: `pnpm test` - Run tests in watch mode using Vitest
- **Test (CI)**: `pnpm test:run` - Run tests once without watch mode

## Package Manager

This project uses `pnpm` as the package manager (version 10.13.1 specified in packageManager field).

## Architecture Overview

This is a TypeScript library that provides debugger snapshot functionality for JavaScript/TypeScript applications. The project consists of two main modules:

### Core Module (`src/index.ts`)
- Exports `DebuggerSnapshot` type and `collectSnapshots` function
- Uses Node.js `AsyncLocalStorage` to collect debugging snapshots during function execution
- Provides both synchronous and asynchronous snapshot collection with proper type inference

### Vite Plugin (`src/vite.ts`) 
- Implements a Vite plugin that transforms `debugger` statements into snapshot collection calls
- Uses Babel for AST parsing and transformation of TypeScript/JSX code
- Automatically imports the debugger-snapshots module and transforms code to capture variable state at debugger points
- Supports special import attribute `type="debugger-snapshots"` to enable transformation
- Recursively transforms imported modules (excluding node_modules)

## Build Configuration

- **tsdown**: Builds both `src/index.ts` and `src/vite.ts` as separate entry points with ESM output
- **TypeScript**: Uses strict mode with modern Node.js module resolution (`nodenext`)
- **Testing**: Vitest with Node.js environment and global test functions enabled

## Package Exports

The package provides two entry points:
- Main: `./dist/index.js` (core snapshot functionality)
- Vite plugin: `./dist/vite.js` (Vite integration)