require('dotenv').config()
const { twitterBotHandlerGenerator } = require('./bot_libs/bot')
const compression = require('compression')
const express = require('express')
const path = require('path')

// Setup Express
const app = express()
app.use(compression())
app.use(express.static('dist'))

// Main endpoint
app.get('/', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'dist/client.html'))
})

// Base puppeteer endpoint
app.get('/puppeteer', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'dist/puppeteer.html'))
})

// Tweet-making endpoint
app.get(`/${process.env.tweetEndpoint}`, (request, response) => {
  twitterBotHandlerGenerator(request, response)
})

// Start the server
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
