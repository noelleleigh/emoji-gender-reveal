/* eslint-env browser */
import './client.css'
import { drawTitleScreen, newEmoji } from './drawFuncs.js'
import { filteredEmojiArray, filterToSingleEmoji, EmojiError } from './emojiFuncs.js'

const canvas = document.getElementById('canvas')
canvas.width = 540
canvas.height = 480
const ctx = canvas.getContext('2d')
const preselectedEmoji = (new URL(document.location)).searchParams.get('emoji')
if (preselectedEmoji) {
  try {
    const singleEmojiArray = filterToSingleEmoji(preselectedEmoji)
    newEmoji(ctx, singleEmojiArray)()
  } catch (err) {
    if (err instanceof EmojiError) {
      console.error(err)
      alert(err.message)
    } else {
      throw err
    }
  }
} else {
  canvas.addEventListener('click', newEmoji(ctx, filteredEmojiArray))
  drawTitleScreen(ctx)
}
