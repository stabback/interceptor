module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    
    // Personal preference
    'import/prefer-default-export': 'off',

    'import/no-cycle': 'off',

    // See discussion: https://github.com/airbnb/javascript/issues/1271
    'no-restricted-syntax': 'off',

    // Used to hide behind getters/setters
    'no-underscore-dangle': 'off',

    'import/order': ['error'],

    // Personal preference
    'no-multiple-empty-lines': ["error", { "max": 3, "maxEOF": 0 }]
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ["@PACKAGE_JSON", "./package.json"],
          ["@client", './client/src'],
          ["@server",  './server'],
          ["@definitions",  './definitions/index.d.ts'],
        ],
        extensions: ['.ts', '.js', '.vue', '.json']
      }
    }
  }
};
