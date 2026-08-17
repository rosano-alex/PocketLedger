const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const API_TARGET = process.env.API_TARGET ?? 'http://localhost:4400';

// React Native packages that ship untranspiled sources, i.e. gluestack's stack.
const NEEDS_BABEL = [
  'react-native-web',
  'react-native-svg',
  '@gluestack-ui',
  '@gluestack-style',
  '@react-native-aria',
  '@react-stately',
  '@react-aria',
  '@legendapp',
  '@expo',
];

// webpack rule conditions accept a predicate, so no patterns are needed.
const extension = (...endings) => (file) => endings.some((ending) => file.endsWith(ending));

module.exports = (_env, argv = {}) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src/main.tsx'),
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
      publicPath: '/',
      clean: true,
    },

    resolve: {
      // gluestack-ui is React Native; on the web it runs through this.
      alias: {
        'react-native$': 'react-native-web',
        '@react-native/assets-registry/registry': false,
      },
      extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
    },

    module: {
      rules: [
        {
          test: extension('.js', '.jsx', '.ts', '.tsx'),
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, '../shared/src'),
            ...NEEDS_BABEL.map((name) => path.resolve(__dirname, '../node_modules', name)),
          ],
          use: { loader: 'babel-loader', options: { cacheDirectory: true } },
        },
        // typed-fsm imports without file extensions.
        { test: extension('.js', '.mjs'), resolve: { fullySpecified: false } },
        { test: extension('.css'), use: ['style-loader', 'css-loader'] },
        // Fonts referenced from CSS. asset/resource, not asset — see fonts.css.
        { test: extension('.otf', '.ttf', '.woff', '.woff2'), type: 'asset/resource' },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'index.html') }),
      // A global the React Native runtime expcts to find.
      new webpack.DefinePlugin({ __DEV__: JSON.stringify(!isProduction) }),
    ],

    devServer: {
      port: 5273,
      // Opens once the server is actually listening, so there is no startup race.
      open: true,
      // One origin in dev; in production Express serves the bundle itself.
      historyApiFallback: true,
      proxy: [{ context: ['/api'], target: API_TARGET, changeOrigin: true }],
    },

	performance: { hints: false },
		stats: 'minimal',
  };
};
