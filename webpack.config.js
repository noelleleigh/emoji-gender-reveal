const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    client: './src/client.js',
    puppeteer: './src/puppeteer.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      chunks: ['client'],
      template: './src/client.html',
      filename: 'client.html'
    }),
    new HtmlWebPackPlugin({
      chunks: ['puppeteer'],
      template: './src/puppeteer.html',
      filename: 'puppeteer.html'
    })
  ]
}
