/* eslint-env browser */
import twemoji from "@twemoji/api";
import { splitStringLines } from "./utils.js";

/**
 * Object with information about a specific emoji
 * @typedef {Object} EmojiObject
 * @property {string} char - The emoji as a string literal
 * @property {string} descr - The Unicode description of the emoji in lower case.
 */

/**
 * Handles boilerplate so you can get access to an HTMLImage element of the
 * emoji to do stuff with.
 * @param {Function} imgLoadCallback - Callback function that takes an image
 * load event when the emoji image has finished loading and is ready to be used.
 * @returns {Function} Function for the callback option of the `twemoji.parse`
 * function. Takes `(icon, options)`.
 */
const useTwemojiImage = (imgLoadCallback) => {
  return (icon, options) => {
    const resolution = options.size
      .split("x")
      .map((val) => Number.parseInt(val, 10));
    const image = new Image(...resolution);
    image.crossOrigin = "anonymous";
    image.src = `${options.base}${options.size}/${icon}.png`;
    image.addEventListener("load", imgLoadCallback);
  };
};

/**
 * Cover the canvas with instances of an image, rotated 45 degrees clockwise.
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {HTMLImageElement} image - The image to fill the canvas with
 * @param {Number} [alpha = 1.0] - The tranparency of the image (0.0 - 1.0)
 */
const fillCanvasWithImage = (ctx, image, alpha = 1.0) => {
  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalAlpha = alpha;
  ctx.translate(ctx.canvas.width / 2, -ctx.canvas.height);
  ctx.rotate(Math.PI / 4);
  for (let y = 0; y < 2 * ctx.canvas.height; y += image.height) {
    for (let x = 0; x < 2 * ctx.canvas.width; x += image.width) {
      ctx.drawImage(image, x, y);
    }
  }
  ctx.restore();
};

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
const roundRect = (
  ctx,
  x,
  y,
  width,
  height,
  radius = 5,
  fill = false,
  stroke = true
) => {
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (const side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
};

/**
 * Like ctx.fillText, but with multiline support.
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {String[]} textArray - The array of lines of text
 * @param {Number} x - X position of text
 * @param {Number} y - Y position of text
 * @param {Number} fontSizePx - The size of the font in pixels
 */
const fillTextMultiline = (ctx, textArray, x, y, fontSizePx) => {
  ctx.save();

  for (let lineIndex = 0; lineIndex < textArray.length; lineIndex += 1) {
    const lineY = y + lineIndex * fontSizePx;
    ctx.fillText(textArray[lineIndex], x, lineY);
  }

  ctx.restore();
};

/**
 * Draw the first scene on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 */
const drawTitleScreen = async (ctx) => {
  ctx.save();

  // Useful constants
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  // Draw pink rectangle
  ctx.fillStyle = "pink";
  ctx.fillRect(0, 0, canvasWidth / 2, canvasHeight);

  // Draw blue rectangle
  ctx.fillStyle = "lightblue";
  ctx.fillRect(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight);

  // Make the emoji strings to retrieve the emoji images
  const femaleSignString = "\u{2640}\u{FE0F}";
  const maleSignString = "\u{2642}\u{FE0F}";
  const questionMarkString = "\u{2753}";

  twemoji.parse(femaleSignString, {
    callback: useTwemojiImage((event) => {
      const img = event.target;
      ctx.drawImage(
        img,
        canvasWidth / 4 - img.width / 2,
        canvasHeight / 2 - img.height / 2
      );
    }),
    onerror: console.error,
  });

  twemoji.parse(maleSignString, {
    callback: useTwemojiImage((event) => {
      const img = event.target;
      ctx.drawImage(
        img,
        canvasWidth - canvasWidth / 4 - img.width / 2,
        canvasHeight / 2 - img.height / 2
      );
    }),
    onerror: console.error,
  });

  twemoji.parse(questionMarkString, {
    callback: useTwemojiImage((event) => {
      const img = event.target;
      ctx.drawImage(
        img,
        canvasWidth / 2 - img.width / 2,
        canvasHeight / 2 - img.height / 2
      );
    }),
    onerror: console.error,
  });

  // Write text
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "bold 2em sans-serif";
  ctx.fillText("What will the new baby be?", canvasWidth / 2, 70);

  // Draw button
  roundRect(
    ctx,
    canvasWidth / 2 - 250 / 2,
    canvasHeight - 100,
    250,
    50,
    5,
    true,
    true
  );

  // Write button text
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.font = "2em sans-serif";
  ctx.fillText("Reveal Gender", canvasWidth / 2, canvasHeight - 100 + 35);

  ctx.restore();
};

/**
 * Draw the specified emoji as a gender on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {EmojiObject} emoji - Information about an emoji
 * @returns {Promise<Object>} Promise resolves to an object with `ctx`,
 * `emoji`, and the `text` that was written on the canvas.
 */
const renderEmojiScene = (ctx, emoji) => {
  return new Promise((resolve, reject) => {
    twemoji.parse(emoji.char, {
      callback: useTwemojiImage((event) => {
        ctx.save();

        // Make a nice variable
        const htmlImage = event.target;

        // Clear the canvas before we start drawing
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Build the string for the text
        const article = `a${
          /^(a|e|i|o|u)/.test(emoji.descr.toLowerCase()) ? "n" : ""
        }`;
        const text = `Congrats! It's ${article} ${emoji.descr.toUpperCase()}! `;
        const textLines = splitStringLines(text, 17);

        // Fill the background with faint emoji
        fillCanvasWithImage(ctx, htmlImage, 0.25);

        // Create the circle where the emoji will be displayed
        const emojiYPos = 100;
        ctx.fillStyle = "lightgrey";
        ctx.beginPath();
        ctx.arc(ctx.canvas.width / 2, emojiYPos, 65, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ctx.canvas.width / 2, emojiYPos, 60, 0, 2 * Math.PI);
        ctx.fill();

        // Draw the emoji in its frame
        ctx.drawImage(
          htmlImage,
          (ctx.canvas.width - htmlImage.width) / 2,
          emojiYPos - htmlImage.height / 2
        );

        // Draw the text beneath
        const fontSize = 46;
        ctx.fillStyle = "#333";
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const textY =
          170 + (ctx.canvas.height - 170 - fontSize * textLines.length) / 2;
        fillTextMultiline(
          ctx,
          textLines,
          ctx.canvas.width / 2,
          textY,
          fontSize
        );

        ctx.restore();
        // Resolve the promise
        resolve({ ctx, emoji, text });
      }),
      onerror: reject,
    });
  });
};

/**
 * Call the `/emoji` endpoint and return the response if OK.
 *
 * If `emoji` is not specified, return a random `EmojiObject`.
 * @param {String} [emoji] - A literal emoji to be validated and returned.
 * @returns {Promise<EmojiObject>} A Promise that resolves to an EmojiObject.
 */
const getEmoji = async (emoji) => {
  // Build the URL to the /emoji endpoint
  let url = "/emoji";
  if (emoji) {
    url += "?" + new URLSearchParams({ emoji: emoji }).toString();
  }

  // Fetch the response
  const response = await fetch(url);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(body));
  } else {
    return body;
  }
};

/**
 * Call `renderEmojiScene` using a randomly selected emoji.
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @returns {Promise<Object>} Promise resolves to an object with `ctx`,
 * `emoji`, and the `text` that was written on the canvas.
 */
const renderRandomEmojiScene = async (ctx) => {
  const emoji = await getEmoji();
  return renderEmojiScene(ctx, emoji);
};

export { drawTitleScreen, renderEmojiScene, renderRandomEmojiScene, getEmoji };
