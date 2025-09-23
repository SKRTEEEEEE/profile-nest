// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Ignorar archivos
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'build/**',
      '**/*.d.ts',
    ],
  },

  // Configuración base
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Configuración personalizada para TS
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/prefer-as-const': 'off',

      // reglas globales
      'no-useless-escape': 'off',
      'no-console': 'off',
      'prefer-const': 'error',
    },
  },
);
