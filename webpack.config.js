const path = require('path');
const webpack = require('webpack');

const config = {
  context: path.join(__dirname, 'src'),
  entry: {
    app: './index.js'
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules']
  },
  externals: {
    'chrome': 'chrome'
  },
  output: {
    path: path.join(__dirname, 'forager'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: []
};

switch ( process.env.npm_lifecycle_event) {
case "webpack:dev":
  break;
case "webpack:prod":
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: false,
      compress: {
        warnings: false
      }
    })
  ]);
  break;
}

module.exports = config;