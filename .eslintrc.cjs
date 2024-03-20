

module.exports = {
  'env': {
    'es2021': true,
    'node': true,
    'jest': true
  },
  'extends': 'eslint:recommended',
  'overrides': [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      }
    }
  ],
  'plugins': [
    '@stylistic/js'
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'rules': {
    'no-unused-vars': [
      'warn'
    ],
    '@stylistic/js/indent': [
      'warn',
      2,
      {
        'SwitchCase': 1
      }
    ],
    '@stylistic/js/linebreak-style': [
      'warn',
      'windows'
    ],
    '@stylistic/js/semi': [
      'warn',
      'always'
    ],
    '@stylistic/js/max-len': [
      'warn',
      {
        'code': 80,
      }
    ]
  }
};
