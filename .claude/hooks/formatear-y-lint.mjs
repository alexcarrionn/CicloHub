// Hook PostToolUse de Claude Code: tras cada Edit/Write formatea el fichero con
// Prettier y, si es TypeScript de src/ o test/, le pasa ESLint con --fix.
// Si quedan errores de ESLint, sale con código 2 para que Claude los vea y los corrija.
// Usa los binarios locales del proyecto (mismas versiones que la CI) y no necesita shell,
// así que funciona igual en Windows, Linux y macOS.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

let entrada = '';
for await (const trozo of process.stdin) entrada += trozo;

let fichero;
try {
  fichero = JSON.parse(entrada)?.tool_input?.file_path;
} catch {
  process.exit(0);
}
if (!fichero || !existsSync(fichero)) process.exit(0);

const raiz = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const relativo = path.relative(raiz, fichero).split(path.sep).join('/');

// Fuera del proyecto o en carpetas generadas: no hacemos nada
if (
  relativo.startsWith('..') ||
  /^(node_modules|dist|coverage|docs\/site)\//.test(relativo)
) {
  process.exit(0);
}

const ejecutar = (script, args) =>
  spawnSync(process.execPath, [path.join(raiz, script), ...args], {
    cwd: raiz,
    encoding: 'utf8',
  });

// 1. Formato (Prettier respeta .prettierignore y omite lo que no sabe formatear)
ejecutar('node_modules/prettier/bin/prettier.cjs', [
  '--write',
  '--ignore-unknown',
  fichero,
]);

// 2. Lint, solo para TypeScript del código y de las pruebas
if (/^(src|test|apps|libs)\/.*\.ts$/.test(relativo)) {
  const lint = ejecutar('node_modules/eslint/bin/eslint.js', [
    '--fix',
    fichero,
  ]);
  if (lint.status !== 0) {
    process.stderr.write(
      `ESLint encuentra problemas en ${relativo} que no se corrigen solos. Arréglalos sin desactivar reglas:\n${lint.stdout}${lint.stderr}`,
    );
    process.exit(2);
  }
}

process.exit(0);
