/* eslint-env browser */
import {
  renderEmojiScene,
  renderRandomEmojiScene,
  getEmoji,
} from "./drawFuncs.js";
import { setupCanvas } from "./utils";

/**
 * Object with information about a specific emoji
 * @typedef {Object} EmojiObject
 * @property {string} char - The emoji as a string literal
 * @property {string} descr - The Unicode description of the emoji in lower case.
 */

/**
 * Takes the output of `renderEmojiScene` and creates DOM objects that the
 * Puppeteer script can consume.
 * @param {Object} args
 * @param {CanvasRenderingContext2D} args.ctx - The canvas context
 * @param {EmojiObject} args.emoji - The canvas context
 * @param {string} args.text - The text that was written on the canvas
 */
const callback = ({ ctx, emoji, text }) => {
  // Add the caption
  const caption = document.createElement("p");
  caption.id = "emoji-caption";
  caption.textContent = text;
  document.body.appendChild(caption);

  // Add the emoji string and description
  const meta = document.createElement("pre");
  meta.id = "emoji-meta";
  meta.textContent = JSON.stringify(emoji);
  document.body.appendChild(meta);

  // Add a link that will download the canvas's content
  const anchor = document.createElement("a");
  anchor.href = ctx.canvas.toDataURL();
  anchor.id = "emoji-link";
  anchor.textContent = "Download Emoji Scene";
  document.body.appendChild(anchor);
};

/**
 * Sets up the canvas, and draws an emoji gender reveal from the emoji provided,
 * or from a randomly picked one.
 * @param {string} [emoji] - The emoji from which to generate a gender reveal.
 */
const main = async (emoji) => {
  // Setup the canvas and get a context to draw with
  const canvas = await setupCanvas(document.body);
  const ctx = canvas.getContext("2d");

  if (emoji) {
    const emojiObj = await getEmoji(emoji);
    renderEmojiScene(ctx, emojiObj).then(callback);
  } else {
    renderRandomEmojiScene(ctx).then(callback);
  }
};

/**
 * Get the emoji query string and call `main()` with it.
 */
const init = () => {
  const emoji = new URL(document.location).searchParams.get("emoji");
  main(emoji);
};

// Start the app!
init();
