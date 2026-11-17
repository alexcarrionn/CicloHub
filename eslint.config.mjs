// @ts-check
import eslint from '@eslint/js';
import { configs, plugins } from 'eslint-config-airbnb-extended';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/*
 * Guía de estilo de Airbnb, tal como exige el enunciado (sección 3.4).
 *
 * El paquete oficial `eslint-config-airbnb` (19.x) solo admite ESLint 7 y 8
 * con el formato `.eslintrc`, arrastra los plugins de React (que el backend
 * no usa) y su adaptador a TypeScript (`eslint-config-airbnb-typescript`)
 * está abandonado y no admite typescript-eslint 8. Por eso se usa
 * `eslint-config-airbnb-extended`, que porta las mismas reglas de Airbnb al
 * formato flat de ESLint 9 y añade su versión para TypeScript.
 *
 * Orden de las capas: reglas recomendadas de ESLint → Airbnb (JS, Node y
 * TypeScript) → typescript-eslint con tipos → Prettier (al final, para que
 * desactive todas las reglas de formato) → ajustes del proyecto justificados.
 */

const airbnbJavascript = [
  plugins.stylistic,
  plugins.importX,
  ...configs.base.recommended,
];

const airbnbNode = [plugins.node, ...configs.node.recommended];

const airbnbTypescript = [plugins.typescriptEslint, ...configs.base.typescript];

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'coverage/**', 'docs/**'],
  },
  eslint.configs.recommended,
  ...airbnbJavascript,
  ...airbnbNode,
  ...airbnbTypescript,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Los finales de línea dependen del sistema de cada miembro (Windows
      // o Linux); Git los normaliza con `.gitattributes`.
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // NestJS genera y resuelve sus piezas (módulos, controladores,
      // proveedores) con exportaciones con nombre, y en DDD un fichero suele
      // exportar una sola clase. Con exportaciones por defecto cada import
      // podría renombrar la clase y se pierde la búsqueda por nombre.
      'import-x/prefer-default-export': 'off',

      // En NestJS los controladores y proveedores se instancian mediante
      // inyección de dependencias: sus métodos son de instancia por contrato
      // del framework aunque no usen `this`. Hacerlos estáticos rompería la
      // inyección y la sustitución por dobles en las pruebas.
      'class-methods-use-this': 'off',
    },
  },
);
