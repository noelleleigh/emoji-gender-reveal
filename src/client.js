/* eslint-env browser */
import './client.css'
import {drawTitleScreen, newEmoji} from './drawFuncs.js'
import {filteredEmojiArray} from './emojiFuncs.js'

const canvas = document.getElementById('canvas')
canvas.width = 540
canvas.height = 480
const ctx = canvas.getContext('2d')
canvas.addEventListener('click', newEmoji(ctx, filteredEmojiArray))

drawTitleScreen(ctx)
