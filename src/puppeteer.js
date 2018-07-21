/* eslint-env browser */
/** @module puppeteer */
import {newEmoji} from './drawFuncs.js'
import {filteredEmojiArray} from './emojiFuncs.js'

const canvas = document.createElement('canvas')
canvas.id = 'canvas'
canvas.width = 540
canvas.height = 480
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')
let emojiArray = filteredEmojiArray
const emoji = (new URL(document.location)).searchParams.get('emoji')
if (emoji) {
  emojiArray = filteredEmojiArray.filter(emojiObj => emojiObj.char === emoji)
}
newEmoji(ctx, emojiArray, (emoji, text) => {
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
})()
