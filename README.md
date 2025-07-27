# 📸 Debugger Snapshots

> Transform your debugging experience with automatic variable state capture. Inspired by [@nandanmen](https://x.com/nandafyi/)'s [debugger snapshots utility](https://github.com/nandanmen/NotANumber/blob/main/lib/algorithm/snapshot.macro.js) in his blog.

[![npm version](https://img.shields.io/npm/v/debugger-snapshots.svg)](https://www.npmjs.com/package/debugger-snapshots)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Debugger Snapshots** automatically captures the state of all variables in scope whenever you hit a `debugger` statement, giving you a complete picture of your application's execution flow without the need for manual logging.

## ✨ Features

- 🔍 **Automatic State Capture** - No more `console.log` debugging
- 📦 **TypeScript Support** - Full type safety and IntelliSense
- 🔄 **Async/Sync Compatible** - Works with both synchronous and asynchronous code
- ⚡ **Vite Integration** - Seamless development workflow

## 🚀 Quick Start

### Installation

```bash
pnpm add debugger-snapshots
# or
npm install debugger-snapshots
# or
yarn add debugger-snapshots
```

### Basic Usage With Vite Plugin

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { debuggerSnapshots } from "debugger-snapshots/vite";

export default defineConfig({
  plugins: [debuggerSnapshots()],
});
```

```typescript
// your-file.ts with type="debugger-snapshots"
import { calculateTotal } from './math.js' with { type: "debugger-snapshots" }

function processOrder(items: Item[]) {
  const subtotal = calculateTotal(items)
  const tax = subtotal * 0.08

  debugger // 📸 Automatically captures: items, subtotal, tax

  return subtotal + tax
}
```

## 📖 API Reference

### `collectSnapshots<T>(fn: () => T): [T, DebuggerSnapshot[]]`

Executes a function and collects all debugger snapshots that occur during its execution.

**Parameters:**

- `fn` - Function to execute and monitor for debugger statements

**Returns:**

- Array containing the function result and collected snapshots
- For async functions: `Promise<[T, DebuggerSnapshot[]]>`

### `DebuggerSnapshot`

```typescript
type DebuggerSnapshot = {
  location: string; // File path and line number (e.g., "src/app.ts#L42")
  time: number; // Timestamp when snapshot was taken
  snapshot: Record<string, unknown>; // All variables in scope
};
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
