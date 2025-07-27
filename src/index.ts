import { AsyncLocalStorage } from "node:async_hooks";

type File = string;
type Line = number;

type Location = `${File}#L${Line}`;

export type DebuggerSnapshot = {
  location: Location;
  time: number;
  snapshot: Record<string, unknown>;
};

export const debuggerSnapshots = new AsyncLocalStorage<DebuggerSnapshot[]>();

type Ret<T> = T extends Promise<infer U>
  ? Promise<[U, DebuggerSnapshot[]]>
  : [T, DebuggerSnapshot[]];

export function collectSnapshots<T>(fn: () => T): Ret<T> {
  const snapshots: DebuggerSnapshot[] = [];
  const ret = debuggerSnapshots.run(snapshots, fn);

  if (ret instanceof Promise) {
    return ret.then((value) => [value, snapshots]) as Ret<T>;
  }

  return [ret, snapshots] as Ret<T>;
}
