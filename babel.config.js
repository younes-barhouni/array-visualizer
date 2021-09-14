// eslint-disable-next-line no-undef
module.exports = function (api) {
    api.cache(true);
  
    return {
      presets: [
        ['@babel/preset-env', {corejs: 3, useBuiltIns: 'entry'}],
        ['@babel/preset-typescript', {allExtensions: true, isTSX: true}],
        '@babel/preset-react'
  
      ],
      'plugins': [
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
        '@babel/plugin-proposal-nullish-coalescing-operator'
      ]
    };
  };
  