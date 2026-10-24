// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ['dist/*', 'supabase/functions/*', '.expo/*'],
  },
  {
    // Der Kern kennt keine Erweiterung (Plan 7.5).
    files: ['src/core/**', 'src/shared/**', 'src/app/**', 'src/services/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/extensions/**'],
              message: 'Kern darf nicht aus src/extensions importieren.',
            },
          ],
        },
      ],
    },
  },
]);
