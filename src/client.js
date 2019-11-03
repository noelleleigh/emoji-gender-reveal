/* eslint-env browser */
import './client.css'
import { drawEmojiScene, drawTitleScreen, newEmoji } from './drawFuncs.js'
import { EmojiError, resolveEmoji } from './emojiFuncs.js'

// Set up the canvas element
const canvas = document.getElementById('canvas')
canvas.width = 540
canvas.height = 480
const ctx = canvas.getContext('2d')

// If a specific emoji was passed in, draw it
const preselectedEmoji = (new URL(document.location)).searchParams.get('emoji')
if (preselectedEmoji) {
  try {
    const singleEmoji = resolveEmoji(preselectedEmoji)
    drawEmojiScene(ctx, singleEmoji)
  } catch (err) {
    if (err instanceof EmojiError) {
      console.error(err)
      alert(err.message)
    } else {
      throw err
    }
  }
} else {
  // Otherwise, draw the title screen and prepare the random emoji handler
  canvas.addEventListener('click', newEmoji(ctx))
  drawTitleScreen(ctx)
}
