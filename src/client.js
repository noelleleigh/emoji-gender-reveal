/* eslint-env browser */
import './client.css'
import { drawTitleScreen, newEmoji } from './drawFuncs.js'
import { filteredEmojiArray } from './emojiFuncs.js'

const canvas = document.getElementById('canvas')
canvas.width = 540
canvas.height = 480
const ctx = canvas.getContext('2d')
const preselectedEmoji = (new URL(document.location)).searchParams.get('emoji')
if (preselectedEmoji) {
  const singleEmojiArray = filteredEmojiArray.filter(emojiObj => emojiObj.char === preselectedEmoji)
  canvas.addEventListener('click', newEmoji(ctx, singleEmojiArray))
} else {
  canvas.addEventListener('click', newEmoji(ctx, filteredEmojiArray))
}

drawTitleScreen(ctx)
