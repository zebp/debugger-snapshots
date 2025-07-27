import type { Plugin } from "vite";

import _traverse from "@babel/traverse";
import _generate from "@babel/generator";
import { parse } from "@babel/parser";
import * as t from "@babel/types";

const traverse = _traverse.default;
const generate = _generate.default;

export function debuggerSnapshots(): Plugin {
  const shouldTransform = new Set<string>();

  return {
    name: "debugger-snapshots",
    enforce: "pre",
    async resolveId(source, _, options) {
      const snapshots = options.attributes?.type === "debugger-snapshots";
      if (!snapshots) {
        return;
      }

      return { id: source, meta: { debuggerSnapshots: true } };
    },
    async transform(code, id) {
      const debuggerSnapshots = this.getModuleInfo(id)?.meta?.debuggerSnapshots;
      if (!debuggerSnapshots && !shouldTransform.has(id)) {
        return;
      }

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
        sourceFilename: id,
      });

      traverse(ast, {
        DebuggerStatement(path) {
          const identifierInScope = Object.keys(path.scope.getAllBindings());
          path.replaceWith(
            snapshot(identifierInScope, id, path.node.loc?.start.line)
          );
        },
      });

      ast.program.body.unshift(
        t.importDeclaration(
          [t.importNamespaceSpecifier(t.identifier(SNAPSHOT))],
          t.stringLiteral("debugger-snapshots")
        )
      );
      const parsed = generate(ast, {
        sourceMaps: true,
        sourceFileName: id,
      });
      return {
        code: parsed.code,
        map: parsed.map as Sourcemap,
      };
    },
    moduleParsed(info) {
      if (info.meta?.debuggerSnapshots || shouldTransform.has(info.id)) {
        shouldTransform.add(info.id);
        info.importedIdResolutions
          .map((id) => id.id)
          .filter((id) => !id.includes("debugger-snapshots"))
          .filter((id) => !id.includes("node_modules"))
          .forEach((id) => shouldTransform.add(id));
      }
    },
  };
}

const SNAPSHOT = "$debuggerSnapshots";

function snapshot(indentifiersInScope: string[], file: string, line?: number) {
  const snapshotsAls = t.memberExpression(
    t.identifier(SNAPSHOT),
    t.identifier("debuggerSnapshots")
  );
  const getStore = t.callExpression(
    t.memberExpression(snapshotsAls, t.identifier("getStore")),
    []
  );
  const dateNow = t.memberExpression(t.identifier("Date"), t.identifier("now"));

  const identifiers = t.objectExpression(
    indentifiersInScope.map((identifier) =>
      t.objectProperty(t.identifier(identifier), t.identifier(identifier))
    )
  );

  const snapshot = t.objectExpression([
    t.objectProperty(
      t.identifier("location"),
      t.stringLiteral(`${file}#L${line ?? 0}`)
    ),
    t.objectProperty(t.identifier("time"), t.callExpression(dateNow, [])),
    t.objectProperty(t.identifier("snapshot"), identifiers),
  ]);

  return t.expressionStatement(
    t.optionalCallExpression(
      t.optionalMemberExpression(getStore, t.identifier("push"), false, true),
      [snapshot],
      true
    )
  );
}

type Sourcemap = {
  file?: string;
  mappings: string;
  names: string[];
  sourceRoot?: string;
  sources: string[];
  sourcesContent?: string[];
  version: number;
  x_google_ignoreList?: number[];
};
