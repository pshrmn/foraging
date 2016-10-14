const path = require('path');
const webpack = require('webpack');

const config = {
  context: path.join(__dirname, 'src'),
  entry: {
    app: './index.js',
    vendor: [
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'd3-hierarchy',
      'd3-path'
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.join(__dirname, 'src')
  },
  externals: {
    'chrome': 'chrome'
  },
  output: {
    path: path.join(__dirname, 'forager'),
    filename: 'bundle.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: '/node_modules/',
        loader: 'eslint-loader'
      }
    ],
    loaders: [
     {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    })
  ]
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