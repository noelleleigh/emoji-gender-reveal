/* eslint-env browser */
/** @module puppeteer */
import { renderEmojiScene, renderRandomEmojiScene } from './drawFuncs.js'
import { resolveEmoji } from './emojiFuncs.js'
import { setupCanvas } from './utils'

const callback = ({ ctx, emoji, text }) => {
  const caption = document.createElement('p')
  caption.id = 'emoji-caption'
  caption.textContent = text
  document.body.appendChild(caption)

  const meta = document.createElement('pre')
  meta.id = 'emoji-meta'
  meta.textContent = JSON.stringify(emoji)
  document.body.appendChild(meta)

  const anchor = document.createElement('a')
  anchor.href = ctx.canvas.toDataURL()
  anchor.id = 'emoji-link'
  anchor.textContent = 'Download Emoji Scene'
  document.body.appendChild(anchor)
}

const main = async (emoji) => {
  const canvas = await setupCanvas(document.body)
  const ctx = canvas.getContext('2d')

  if (emoji) {
    const emojiObj = resolveEmoji(emoji)
    renderEmojiScene(ctx, emojiObj).then(callback)
  } else {
    renderRandomEmojiScene(ctx).then(callback)
  }
}

const init = () => {
  const emoji = (new URL(document.location)).searchParams.get('emoji')
  main(emoji)
}

init()
