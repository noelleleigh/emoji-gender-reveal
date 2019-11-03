const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const SriPlugin = require('webpack-subresource-integrity')

module.exports = {
  entry: {
    client: './src/client.js',
    puppeteer: './src/puppeteer.js'
  },
  output: {
    crossOriginLoading: 'anonymous'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HardSourceWebpackPlugin(),
    new HtmlWebPackPlugin({
      chunks: ['client'],
      template: './src/client.html',
      filename: 'client.html'
    }),
    new HtmlWebPackPlugin({
      chunks: ['puppeteer'],
      template: './src/puppeteer.html',
      filename: 'puppeteer.html'
    }),
    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: true
    })
  ]
}
