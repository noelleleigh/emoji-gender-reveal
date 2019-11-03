/* eslint-env browser */
/** @module puppeteer */
import { drawEmojiScene, newEmoji } from './drawFuncs.js'
import { resolveEmoji } from './emojiFuncs.js'

/**
 * Callback function called when the rendering is complete.
 * @param {Object} emoji An object with `char` and `descr` properties
 * @param {String} text The words that were on the image
 */
const callback = (emoji, text) => {
  const caption = document.createElement('p')
  caption.id = 'emoji-caption'
  caption.textContent = text
  document.body.appendChild(caption)

  const meta = document.createElement('pre')
  meta.id = 'emoji-meta'
  meta.textContent = JSON.stringify(emoji)
  document.body.appendChild(meta)

  const anchor = document.createElement('a')
  anchor.href = canvas.toDataURL()
  anchor.id = 'emoji-link'
  anchor.textContent = 'Download Emoji Scene'
  document.body.appendChild(anchor)
  console.info('Done')
}

// Set up the canvas element
const canvas = document.createElement('canvas')
canvas.id = 'canvas'
canvas.width = 540
canvas.height = 480
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')

const emoji = (new URL(document.location)).searchParams.get('emoji')
if (emoji) {
  const emojiObj = resolveEmoji(emoji)
  drawEmojiScene(ctx, emojiObj)
} else {
  newEmoji(ctx, callback)()
}
