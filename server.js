require("dotenv").config();
const {
  resolveEmoji,
  selectRandomEmoji,
  EmojiError,
} = require("./emoji_libs/emojiFuncs");
const compression = require("compression");
const express = require("express");
const path = require("path");

// Setup Express
const app = express();
app.use(compression());
app.use(express.static("dist"));

// Main endpoint
app.get("/", (request, response) => {
  response.sendFile(path.resolve(__dirname, "dist/client.html"));
});

// Emoji endpoint
app.get("/emoji", async (request, response) => {
  if (request.query && request.query.emoji) {
    // Check if a specific emoji was requested
    const requestedEmoji = String(request.query.emoji);
    try {
      // Return the resolved emoji object
      response.json(resolveEmoji(requestedEmoji));
    } catch (error) {
      if (error instanceof EmojiError) {
        // This is when an invalid emoji was requested
        response.status(403).json({
          error: `The requested emoji "${requestedEmoji}" is not allowed or unavailable.`,
        });
      } else {
        // This is for unhandled errors
        response.status(500).json({
          error: error,
        });
      }
    }
  } else {
    // without a query string, just return a random emoji
    response.json(selectRandomEmoji());
  }
});

// Base puppeteer endpoint
app.get("/puppeteer", (request, response) => {
  response.sendFile(path.resolve(__dirname, "dist/puppeteer.html"));
});

const IS_DEV = process.env.NODE_ENV === "development";
const HOST = IS_DEV ? "localhost" : undefined;
const PORT = process.env.PORT;

// Start the server
var listener = app.listen(PORT, HOST, () => {
  console.log(`View app at http://localhost:${listener.address().port}`);
});
