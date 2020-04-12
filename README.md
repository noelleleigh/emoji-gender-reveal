# emoji-gender-reveal

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/noelleleigh/emoji-gender-reveal)

Need a card for a gender reveal party? Emoji Gender Reveal has you covered with the latest in emoji gender technology!
Just click the card to randomly pick a new emoji gender!

Play with it live on [Glitch 🎏](https://emoji-gender-reveal.glitch.me)

![What will the new baby be?](https://cdn.jsdelivr.net/gh/noelleleigh/emoji-gender-reveal@265db182c4d2f6f2743df930359429ca1631cd9e/readme_assets/titlescreen.png)
![Congrats! It's a PERSON PLAYING HANDBALL: MEDIUM-DARK SKIN TONE](https://cdn.jsdelivr.net/gh/noelleleigh/emoji-gender-reveal@265db182c4d2f6f2743df930359429ca1631cd9e/readme_assets/emojiscreen.png)

## Usage

Click on the title card to generate a new random emoji gender reveal.

### 🚫 Disallowed Emoji

Not all emoji are permitted on this app:

- Emoji that reference oppressive structures (such as [POLICE OFFICER](https://emojipedia.org/police-officer/) or [CUSTOMS](https://emojipedia.org/passport-control/)) are not allowed.
- Emoji that are too close to a real gender reveal (such as [BOY](https://emojipedia.org/boy/) or [WOMAN](https://emojipedia.org/woman/)) aren't funny and thus are not allowed.

These restrictions are defined in the `emojiFilter()` function in `src/emojifuncs.js`. If you find additional emoji that should not be used according to those criteria, [submit an issue on GitHub](https://github.com/noelleleigh/emoji-gender-reveal/issues) with your reasoning, and it will be considered.

## Project Structure

### 📁 `/`

Root directory

### 📄 `server.js`

The Express routing server, the origin of all the behavior of this app. Defines 3 routes:

1. A main route `/` which returns the main app page.
1. An emoji route `/emoji` which returns a random emoji (saves the browser from having to download the whole list at the beginning).
1. A puppeteer route `/puppeteer` which returns a simplified app page suitable for automated retrieval.
1. A tweeting route, defined by the `tweetEndpoint` environment variable in `.env`, which causes a tweet to be posted to the configured Twitter account.

### 📄 `.env`

Environment variable definition file.
See [Twitter bot usage](#twitter-bot-usage) for details.

### 📁 `src/`

This folder contains the code and assets that will get packaged by [Rollup](https://rollupjs.org/) for delivery to the user's browser.

#### 📄 `src/client.*`

The `client.*` files are files that are used to build the main page of the web app that users will see.

#### 📄 `src/puppeteer.*`

The `puppeteer.*` files are files that are used to build the page of the web app that a [headless `puppeteer` instance](https://github.com/GoogleChrome/puppeteer) of Chromium will use to retrieve the generated emoji image for the Twitter bot.

#### 📄 `src/drawFuncs.js`

This file contains all the functions that draw an image onto a [`<canvas>` context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)

#### 📄 `src/utils.js`

This file contains miscellaneous helper functions for other files to import when needed.

### 📁 `bot_libs/`

These Node.js scripts are where the Twitter bot operation lives. They are not inluded in Rollup.

#### 📄 `bot_libs/bot.js`

This file contains the function `twitterBotHandlerGenerator` which handles an Express request to the Twitter bot route (defined in `server.js`).

#### 📄 `bot_libs/puppeteer.js`

This file contains the functions necessary to automatically extract the generated emoji gender reveal image and associated metadata from the puppeteer route for the Twitter bot.

#### 📄 `bot_libs/twitter.js`

This file contains the functions for uploading media and posting a Tweet.

### 📁 `emoji_libs/`

Node.js and other scripts and files related to processing emoji.

#### 📄 `emoji_libs/emojiFuncs.js`

This file contains helper functions focused on manipulating lists of emoji.

### 📄 `emoji_libs/emoji_test_extractor.py`

A Python script used for creating a JSON file of all fully-qualified emoji from the Unicode 12.1 [emoji-test.txt](https://unicode.org/Public/emoji/12.1/emoji-test.txt) file.

#### 📄 `emoji_libs/emoji.json`

This file is a JSON array of all the fully-qualified emoji from Unicode 12.1 and is the source of the emoji code points and descriptions that this app uses.

```json
[
  [
    "\ud83d\ude00",
    {
      "char": "\ud83d\ude00",
      "descr": "grinning face"
    }
  ],
  ...
]
```

It is an array of key-value pairs, with the key being the string of the emoji, and the value being an object with the properties `char` (Unicode string of the emoji) and `descr` (the emoji's official description in lower-case). This file is generated using the `emoji_libs/emoji_test_extractor.py` script from Unicode's [emoji-test.txt](https://unicode.org/Public/emoji/12.1/emoji-test.txt) file.

## Install from GitHub

```bash
git clone https://github.com/noelleleigh/emoji-gender-reveal.git
cd emoji-gender-reveal
```

Specify the port you want it to run on in an `.env` file. Example:

```ini
PORT=8080
```

Then run

```bash
npm install
npm start
```

Once the build is complete and the server has started, open <http://localhost:8080> (replace `8080` with whatever port you chose).

## Twitter bot usage

To use this as a Twitter bot, fill in the necessary information in a `.env` file in the project root.

Here is a sample `.env` template you can populate:

```ini
tweetEndpoint=

TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN_KEY=
TWITTER_ACCESS_TOKEN_SECRET=
```

- `tweetEndpoint` is the route that when visited, will trigger a tweet to be posted. If you're hosting this on a publicly accessible server, you should use a hard-to-guess name to prevent abuse.
- For `TWITTER_*` values, see the [Authentication: Access Tokens](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens.html) guide on the Twitter developer documentation. Since this bot posts to an account, it needs a consumer to act on behalf of an account (the bot account).

Here's what that would look like filled out (with dummy values):

```ini
tweetEndpoint=k5jh32g5k2j

TWITTER_CONSUMER_KEY=weuyro234y2
TWITTER_CONSUMER_SECRET=sadGAS435DGAERgegsegASgAESg3
TWITTER_ACCESS_TOKEN_KEY=12342341235-sdgaEAFF3453DWF
TWITTER_ACCESS_TOKEN_SECRET=cxmnbvsljrdblmjhb43jhb452
```

Once these values are filled out, save the file and run `npm start` to start the server. HTTP GET requests to the `tweetEndpoint` you specified will post a tweet with an image and return a JSON object of the response from Twitter. If you want the bot to post automatically, you'll need to setup a [cron job](https://www.google.com/search?q=free+web+cron) to hit your server on a regular interval.

If you want to generate a specific emoji, you can use the `emoji` query parameter. If you want to test the tweet endpoint without actually posting a real tweet, you can use the `noTweet=true` query parameter.

Example (pretend to tweet the robot emoji):

```url
http://localhost:8080/k5jh32g5k2j?emoji=🤖&noTweet=true
```

## To Do

- Add support for HTTP authentication on the bot endpoint.
- Extract out the disallowed emoji list to make it easily editable.
- Add loading indicators for slow connections.
- Improve experience on screen readers.

## Credits

- [twemoji](https://github.com/twitter/twemoji) - Twitter's emoji image library
- [node-twitter](https://github.com/desmondmorris/node-twitter) - Node.js library for interacting with Twitter's API.
- [Rollup](https://github.com/rollup/rollup) - JavaScript module bundler
