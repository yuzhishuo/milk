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
  rules: {

    "camelcase": "off",
    "@typescript-eslint/camelcase": [0, { "properties": "always" }],

    "brace-style": "off",
    "@typescript-eslint/brace-style": ["error", "allman", { "allowSingleLine": true }],
    "@typescript-eslint/class-name-casing": 0,

    "indent": "off",
    "@typescript-eslint/indent": ["error", 4],

    "adjacent-overload-signatures": 0,
    "@typescript-eslint/adjacent-overload-signatures": 1,

    "@typescript-eslint/array-type": [2, {
      "type": "string",
      "enum": [
        "array",
      ]
    }],

    "@typescript-eslint/await-thenable": 2,

    "@typescript-eslint/ban-ts-comment": 2,

    "@typescript-eslint/ban-ts-comment": 2,

    "@typescript-eslint/ban-types": [ "error", {
        // https://palantir.github.io/tslint/rules/ban-types/
        "types": {
          "Object": "Use {} instead",
          "String": {
            "message": "Use string instead",
            "fixWith": "string"
          }
        }
      }
    ],

    "comma-spacing": "off",
    "@typescript-eslint/comma-spacing": ["error", { "before": false, "after": true }],

    // "@typescript-eslint/default-param-last": ["error", { // defaults
    //   // https://github.com/typescript-eslint/typescript-eslint/blob/v2.18.0/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
    //   "allowExpressions": false,
    //   "allowTypedFunctionExpressions": true,
    //   "allowHigherOrderFunctions": true,
    // }],

    // is over strict?
    // "@typescript-eslint/explicit-member-accessibility": ["error"],

    "func-call-spacing": "off",
    "@typescript-eslint/func-call-spacing": ["error"],

    "@typescript-eslint/interface-name-prefix": ["error", { "prefixWithI": "never" }],

    "@typescript-eslint/no-this-alias": [
      "error",
      {
        allowDestructuring: true, // Allow `const { props, state } = this`; false by default
        allowedNames: ["self"], // Allow `const self = this`; `[]` by default
      },
    ],
    "@typescript-eslint/no-require-imports": ["error"],

    "@typescript-eslint/type-annotation-spacing": ["error", { "before": false, "after": true, overrides: { arrow: { before: true, after: true }} }],


    "@typescript-eslint/prefer-string-starts-ends-with": 1,

    "@typescript-eslint/prefer-for-of": 1,

    "@typescript-eslint/promise-function-async": [
      "error",
      {
        "allowedPromiseNames": ["Thenable"],
        "checkArrowFunctions": true,
        "checkFunctionDeclarations": true,
        "checkFunctionExpressions": true,
        "checkMethodDeclarations": true
      }
    ],

    "@typescript-eslint/no-unused-vars-experimental": ["warn", {
      ignoredNamesRegex: '^_',
      ignoreArgsIfArgsAfterAreUsed: false,
    }],

    "@typescript-eslint/no-untyped-public-signature": ["error", { "ignoredMethods": ["ignoredMethodName"] }],

    "no-constant-condition": ["error", { "checkLoops": false }],
    "@typescript-eslint/no-unnecessary-condition": ["error", { "allowConstantLoopConditions": true}],

    "@typescript-eslint/no-unnecessary-qualifier": 1,

    "@typescript-eslint/no-unnecessary-type-arguments": 1,

    "@typescript-eslint/no-misused-new": "error",

    "@typescript-eslint/no-extraneous-class": "error",

    "@typescript-eslint/no-floating-promises": 2,

    "@typescript-eslint/no-var-requires": 2,

    "@typescript-eslint/prefer-as-const": 1,

    "@typescript-eslint/prefer-function-type": 1,

    "@typescript-eslint/prefer-includes": 2,

    "@typescript-eslint/prefer-namespace-keyword" : 2,

    "@typescript-eslint/prefer-nullish-coalescing": 2,

    "@typescript-eslint/prefer-optional-chain": 2,

    "@typescript-eslint/require-array-sort-compare": 1,

    "@typescript-eslint/restrict-plus-operands": ["error", { "checkCompoundAssignments": true }],

    "@typescript-eslint/restrict-template-expressions": ["error"],

    "@typescript-eslint/space-before-function-paren" : ["error"],

    /* !!!important */ /* unuse */
    // "@typescript-eslint/strict-boolean-expressions" : ["error"],

    /* !!!important */
    "@typescript-eslint/unbound-method": [
      // https://github.com/typescript-eslint/typescript-eslint/blob/v2.18.0/packages/eslint-plugin/docs/rules/unbound-method.md
      "error",
      {
        "ignoreStatic": true
      }
    ],

    "@typescript-eslint/unified-signatures": ["warn"]
  }
};