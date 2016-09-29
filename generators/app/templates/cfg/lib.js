'use strict';

let path = require('path');
let webpack = require('webpack');
const winston = require('winston');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

const libraryName = 'washemo-20';
const outputFile = libraryName + '.min.js';
const rootDir = `${__dirname}/..`;
const libDir = `${rootDir}/dist/lib`;

let config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../src/lib'),
  cache: false,
  devtool: 'sourcemap',
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: defaultSettings.getDefaultModules(),
  output: {
    path: libDir,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  exclude: /(node_modules|bower_components|index.js)/,
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  },
  serverConfig: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: defaultSettings.port,
    publicPath: '/lib/',
    noInfo: false
  },
  pageToOpen: 'library.html'
});

winston.log('info', `Generating library at: ${rootDir}`);

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [path.join(__dirname, '/../src')]
  ),
  query: {
    presets: ['es2015', 'stage-0']
  }

});

module.exports = config;
