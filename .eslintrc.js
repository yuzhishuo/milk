// how to config the project.
// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      tsconfigRootDir: __dirname,
      project: ['./tsconfig.json'],
    },
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    rules : {
      // note you must disable the base rule as it can report incorrect errors
      "camelcase": "off",
      "@typescript-eslint/camelcase": [ 0, { "properties": "always" }],
        // note you must disable the base rule as it can report incorrect errors
      "brace-style": "off",
      "@typescript-eslint/brace-style": ["error", "allman", { "allowSingleLine": true }],
      "@typescript-eslint/class-name-casing": 0
    }
  };