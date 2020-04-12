/* eslint-env browser */
import { drawTitleScreen, renderRandomEmojiScene } from "./drawFuncs.js";
import { setupCanvas } from "./utils";

/**
 * Prepares the canvas, draws the title graphic, and sets up event listeners to
 * render random emoji scenes.
 */
const main = async () => {
  // Create the <canvas> and get a context to draw with
  const canvas = setupCanvas(document.querySelector("main"));
  const ctx = canvas.getContext("2d");

  // Draw the "What will the new baby be?" screen
  await drawTitleScreen(ctx);

  // Let the user click or press Enter or Space to make a new emoji gender
  canvas.addEventListener("click", () => {
    renderRandomEmojiScene(ctx);
  });
  canvas.addEventListener("keyup", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      renderRandomEmojiScene(ctx);
    }
  });
};

// Call the function to start the app!
main();
