const {generateEmojiScene} = require('./puppeteer')
const {getTwitterClient, sendTweet} = require('./twitter')

/**
 * Handle HTTP request to the tweeting endpoint
 * @param {Express.request} request - The request to the tweeting endpoint
 * @param {Express.response} response - The response for the request
 */
const twitterBotHandlerGenerator = async (request, response) => {
  const isProd = process.env.ENVIRONMENT === 'production'
  const port = process.env.PORT
  const scheme = `http${port === 443 ? 's' : ''}`
  const host = `${request.hostname}${isProd ? '' : ':' + port}`
  const puppeteerURL = `${scheme}://${host}/puppeteer`
  const emojiResult = await generateEmojiScene(
    puppeteerURL,
    '#emoji-link',
    '#emoji-meta',
    '#emoji-caption'
  )
  const client = getTwitterClient()
  try {
    const sentTweet = await sendTweet(client, emojiResult.caption, emojiResult.imageData)
    console.log(sentTweet)
    response.status(200).type('text/json').send(sentTweet)
  } catch (err) {
    console.error(err)
    response.status(500).send(err.message)
  }
}

module.exports = {
  twitterBotHandlerGenerator
}