const webpack = require('webpack');

module.exports = {
  context: __dirname + '/src',
  entry: {
    app: './index.js',
    vendor: ['react', 'react-dom', 'd3']
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: {
    'chrome': 'chrome'
  },
  output: {
    path: __dirname + '/forager/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
     {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
  ]
};
