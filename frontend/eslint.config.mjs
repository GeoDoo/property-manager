import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

// Fix any potential issues with globals that have whitespace
const browserGlobals = { ...globals.browser };
// Ensure no keys with whitespace
Object.keys(browserGlobals).forEach(key => {
  if (key.trim() !== key) {
    const trimmedKey = key.trim();
    browserGlobals[trimmedKey] = browserGlobals[key];
    delete browserGlobals[key];
  }
});

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: browserGlobals,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
