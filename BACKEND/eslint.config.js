export default [
  {
    files: ['**/*.{js,mjs}'],
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        test: 'readonly',
        assert: 'readonly',
        fetch: 'readonly'
      }
    },
    plugins: {},
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }]
    }
  }
];
