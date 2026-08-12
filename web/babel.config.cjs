// One pipeline for webpack and Jest. Babel rather than ts-loader because the
// React Native packages ship untranspiled JSX in `.js` files. Types are
// checked seperately by `npm run typecheck`.
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { esmodules: true }, bugfixes: true }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
};
