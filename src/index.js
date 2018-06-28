/* eslint-env browser */
import './index.css'
import emojiArray from './emoji.json'
import twemoji from 'twemoji'

/**
 * Test that string only contains a single supported emoji.
 * "Supported" means that twemoji can retrieve a single image for it.
 * @param {String} string - String to check for emoji
 * @returns {Bool}
 */
const testHasEmoji = (string) => {
  const parsed = twemoji.parse(string)
  const div = document.createElement('div')
  div.innerHTML = parsed
  return (div.textContent === '' && div.childElementCount === 1)
}

/**
 * Return a randomly chosen entry from `emojiArray` that is supported by twemoji.
 * @param {Object[]} emojiArray - Array of objects containing `char` properties
 * @returns {Object} {char: <String>, descr: <String>}
 */
const selectSupportedEmoji = (emojiArray) => {
  let foundSupportedEmoji = false
  let index = null
  while (!foundSupportedEmoji) {
    index = Math.floor(Math.random() * emojiArray.length)
    foundSupportedEmoji = testHasEmoji(emojiArray[index].char)
  }
  return emojiArray[index]
}

const canvas = document.getElementById('canvas')
canvas.width = 500
canvas.height = 400
const ctx = canvas.getContext('2d')

/**
 * Cover the canvas with instances of an image.
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {HTMLImageElement} image - The image to fill the canvas with
 */
const fillCanvasWithImage = (ctx, image) => {
  ctx.save()
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (let y = 0; y < ctx.canvas.height; y += image.height) {
    for (let x = 0; x < ctx.canvas.width; x += image.width) {
      ctx.drawImage(image, x, y)
    }
  }
  ctx.restore()
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * Source: https://stackoverflow.com/a/3368118/9165387
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
const roundRect = (ctx, x, y, width, height, radius, fill, stroke) => {
  if (typeof stroke === 'undefined') {
    stroke = true
  }
  if (typeof radius === 'undefined') {
    radius = 5
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius}
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0}
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side]
    }
  }
  ctx.beginPath()
  ctx.moveTo(x + radius.tl, y)
  ctx.lineTo(x + width - radius.tr, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
  ctx.lineTo(x + width, y + height - radius.br)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
  ctx.lineTo(x + radius.bl, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
  ctx.lineTo(x, y + radius.tl)
  ctx.quadraticCurveTo(x, y, x + radius.tl, y)
  ctx.closePath()
  if (fill) {
    ctx.fill()
  }
  if (stroke) {
    ctx.stroke()
  }
}

/**
 * Draws the text in large black lettering over a white rounded rect in the center of the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {String[]} textArray - Array of strings to go on the canvas. Each string will be on a line.
 */
const drawBigCenteredText = (ctx, textArray) => {
  ctx.save()
  ctx.fillStyle = 'white'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  const fontSize = 48
  ctx.font = `bold ${fontSize}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const textStartingY = (ctx.canvas.height - ((textArray.length - 1) * fontSize)) / 2
  roundRect(ctx, 5, textStartingY - fontSize / 2, ctx.canvas.width - 10, textArray.length * fontSize, 10, true)
  for (let line = 0; line < textArray.length; line += 1) {
    ctx.fillStyle = 'black'
    const textY = textStartingY + (line * fontSize)
    ctx.fillText(textArray[line], ctx.canvas.width / 2, textY, ctx.canvas.width - 10)
    // ctx.strokeText(textArray[line], ctx.canvas.width / 2, textY, ctx.canvas.width)
  }
  ctx.restore()
}

/**
 * Fill the canvas with a randomly chosen emoji
 */
const newEmoji = () => {
  const emoji = selectValidEmoji()
  twemoji.parse(emoji.char, {
    callback: (icon, options, varient) => {
      const url = `${options.base}${options.size}/${icon}.png`
      const image = new Image(...options.size.split('x').map(val => Number.parseInt(val, 10)))
      image.src = url
      image.addEventListener('load', event => {
        fillCanvasWithImage(ctx, image)
        drawBigCenteredText(ctx, `It's a ${emoji.descr.toUpperCase()}!`)
      })
    },
    onerror: (error) => console.error(error)
  })
}

drawBigCenteredText(ctx, "What's the baby's gender?")
const button = document.createElement('button')
button.textContent = 'Click for new gender'
button.addEventListener('click', newEmoji)
document.querySelector('main').appendChild(button)
