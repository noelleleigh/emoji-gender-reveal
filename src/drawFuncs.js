/* eslint-env browser */
import twemoji from 'twemoji'
import {useTwemojiImage, selectRandomEmoji} from './emojiFuncs.js'
import {splitStringLines} from './utils.js'

/**
 * Cover the canvas with instances of an image, rotated 45 degrees
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {HTMLImageElement} image - The image to fill the canvas with
 * @param {Number} alpha - The tranparency of the image (0.0 - 1.0)
 */
const fillCanvasWithImage = (ctx, image, alpha) => {
  ctx.save()
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.globalAlpha = alpha
  ctx.translate(ctx.canvas.width / 2, -ctx.canvas.height)
  ctx.rotate(Math.PI / 4)
  for (let y = 0; y < 2 * ctx.canvas.height; y += image.height) {
    for (let x = 0; x < 2 * ctx.canvas.width; x += image.width) {
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
 * Like ctx.fillText, but with multiline support.
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {String[]} textArray - The array of lines of text
 * @param {Number} x - X position of text
 * @param {Number} y - Y position of text
 * @param {Number} fontSizePx - The size of the font in pixels
 */
const fillTextMultiline = (ctx, textArray, x, y, fontSizePx) => {
  ctx.save()

  for (let lineIndex = 0; lineIndex < textArray.length; lineIndex += 1) {
    const lineY = y + (lineIndex * fontSizePx)
    ctx.fillText(textArray[lineIndex], x, lineY)
  }

  ctx.restore()
}

/**
 * Draw the first scene on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 */
const drawTitleScreen = (ctx) => {
  ctx.save()

  // Useful constants
  const canvasWidth = ctx.canvas.width
  const canvasHeight = ctx.canvas.height

  // Draw pink rectangle
  ctx.fillStyle = 'pink'
  ctx.fillRect(0, 0, canvasWidth / 2, canvasHeight)

  // Draw blue rectangle
  ctx.fillStyle = 'lightblue'
  ctx.fillRect(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight)

  // Make the emoji strings to retrieve the emoji images
  const femaleSignString = '\u{2640}\u{FE0F}'
  const maleSignString = '\u{2642}\u{FE0F}'
  const questionMarkString = '\u{2753}'

  twemoji.parse(femaleSignString, {
    callback: useTwemojiImage((event) => {
      const img = event.target
      ctx.drawImage(
        img,
        (canvasWidth / 4) - (img.width / 2),
        (canvasHeight / 2) - (img.height / 2)
      )
    }),
    onerror: console.error
  })

  twemoji.parse(maleSignString, {
    callback: useTwemojiImage((event) => {
      const img = event.target
      ctx.drawImage(
        img,
        canvasWidth - (canvasWidth / 4) - (img.width / 2),
        (canvasHeight / 2) - (img.height / 2)
      )
    }),
    onerror: console.error
  })

  twemoji.parse(questionMarkString, {
    callback: useTwemojiImage((event) => {
      const img = event.target
      ctx.drawImage(
        img,
        (canvasWidth / 2) - (img.width / 2),
        (canvasHeight / 2) - (img.height / 2)
      )
    }),
    onerror: console.error
  })

  // Write text
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.font = 'bold 2em sans-serif'
  ctx.fillText('What will the new baby be?', canvasWidth / 2, 70)
  // ctx.lineWidth = 1.0
  // ctx.strokeText('What will the new baby be?', canvasWidth / 2, 70)

  // Draw button
  roundRect(ctx, (canvasWidth / 2) - (250 / 2), canvasHeight - 100, 250, 50, 5, true, true)

  // Write button text
  ctx.fillStyle = 'black'
  ctx.textAlign = 'center'
  ctx.font = '2em sans-serif'
  ctx.fillText('Reveal Gender', canvasWidth / 2, canvasHeight - 100 + 35)

  ctx.restore()
}

/**
 * Renders the scene for a given emoji in the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Object} emoji - Object with the properties `char` and `descr`
 * @param {Function} callback - Callback function called when the rendering is complete.
 * Takes arguments (emoji, ctx, text)
 */
const drawEmojiScene = (ctx, emoji, callback) => {
  twemoji.parse(emoji.char, {
    callback: useTwemojiImage((event) => {
      ctx.save()

      // Clear the canvas before we start drawing
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      // Build the string for the text
      const text = `Congrats! It's a${/^(a|e|i|o|u)/.test(emoji.descr.toLowerCase()) ? 'n' : ''} ${emoji.descr.toUpperCase()}! `
      const textLines = splitStringLines(text, 17)

      // Fill the backgroun with faint emoji
      fillCanvasWithImage(ctx, event.target, 0.25)

      // Create the circle where the emoji will be displayed
      const emojiYPos = 100
      ctx.fillStyle = 'lightgrey'
      ctx.beginPath()
      ctx.arc(ctx.canvas.width / 2, emojiYPos, 65, 0, 2 * Math.PI)
      ctx.fill()

      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(ctx.canvas.width / 2, emojiYPos, 60, 0, 2 * Math.PI)
      ctx.fill()

      // Draw the emoji in its frame
      ctx.drawImage(event.target, (ctx.canvas.width - event.target.width) / 2, emojiYPos - (event.target.height / 2))

      // Draw the text beneath
      const fontSize = 48
      ctx.fillStyle = '#333'
      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      const textY = 170 + ((ctx.canvas.height - 170) - fontSize * textLines.length) / 2
      fillTextMultiline(ctx, textLines, ctx.canvas.width / 2, textY, fontSize)

      ctx.restore()

      if (callback) callback(emoji, text)
    }),
    onerror: (error) => console.error(error)
  })
}

/**
 * Select a random emoji from emojiArray and render its scene
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Object[]} emojiArray - Array of objects containing `char` and `descr` properties
 * @param {Function} callback - Callback function (emoji, text) called when the rendering is complete.
 * @returns {Function}
 */
const newEmoji = (ctx, emojiArray, callback) => {
  return () => {
    // const emoji = {
    //   'char': '\u{1F916}',
    //   'descr': 'man in suit levitating: medium-light skin tone'
    // }
    const emoji = selectRandomEmoji(emojiArray)
    drawEmojiScene(ctx, emoji, callback)
  }
}

export {newEmoji, drawEmojiScene, drawTitleScreen}
