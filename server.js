require('dotenv').config()
const path = require('path')
const express = require('express')
const app = express()
const {twitterBotHandlerGenerator} = require('./bot_libs/bot')

app.use(express.static('dist'))

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

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
