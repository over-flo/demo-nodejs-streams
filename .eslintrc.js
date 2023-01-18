module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: { sourceType: 'module' },
  ignorePatterns: [
    '**/__generated__/**/*', // where to store generated code to be ignore from linter e.g db migration classes
  ],
  overrides: [

    // for non nestjs typescript
    {
      files: ['*.js'],

      parser: '@typescript-eslint/parser',
      extends: ['airbnb-base', 'eslint:recommended'],
      rules: {
        'no-underscore-dangle': 'off', // necessary for graphql convention
      },
    },
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      extends: [
        'airbnb-base',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
      ],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
      plugins: ['@typescript-eslint/eslint-plugin', 'import'],
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.ts'],
            paths: ['src'],
          },
        },
      },
      rules: {
        camelcase: 'off', // idac habits
        indent: [
          'error',
          2,
          {
            SwitchCase: 1,
            // TODO remove ignore when ticket will be resolved :
            // https://github.com/typescript-eslint/typescript-eslint/issues/1824
            ignoredNodes: [
              'FunctionExpression > .params[decorators.length > 0]',
              'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
              'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
            ],
          },
        ],
        'implicit-arrow-linebreak': 'off', // idac habits
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            ts: 'never',
          },
        ],
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: ['**/*.test.ts', '**/*spec.ts', '**/*.seed.ts'] },
        ],
        'import/no-cycle': 'off', // idac habits
        'import/prefer-default-export': 'off', // idac habits
        'max-len': ['warn', { code: 140 }],
        'no-shadow': 'off', // idac habits
        'no-underscore-dangle': 'off', // necessary for graphql convention
        'no-use-before-define': 'off', // idac habits
        'no-useless-constructor': 'off', // idac habits
        '@typescript-eslint/no-useless-constructor': 'error', // idac habits
        '@typescript-eslint/no-shadow': ['error'], // idac habits
        '@typescript-eslint/no-explicit-any': 'off', // idac habits
        '@typescript-eslint/interface-name-prefix': 'off', // idac habits
        '@typescript-eslint/explicit-function-return-type': 'off', // idac habits
      },
    },
    {
      files: ['**/__tests__/*.{t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
  // to fix : Error while loading rule 'jest/no-deprecated-functions': Unable to detect Jest version
  settings: {
    jest: {
      version: 27,
    },
  },
};
