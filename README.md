# emoji-gender-reveal
Need a card for a gender reveal party? Emoji Gender Reveal has you covered with the latest in emoji gender technology!
Just click the card to randomly pick a new emoji gender!

Play with it live on [Glitch 🎏](https://emoji-gender-reveal.glitch.me)

![What will the new baby be?](https://cdn.rawgit.com/noahleigh/emoji-gender-reveal/265db182/readme_assets/titlescreen.png)
![Congrats! It's a PERSON PLAYING HANDBALL: MEDIUM-DARK SKIN TONE](https://cdn.rawgit.com/noahleigh/emoji-gender-reveal/265db182/readme_assets/emojiscreen.png)

## Project Structure
### ./bot_libs
These Node.js scripts are where the Twitter bot operation lives. They are not Webpacked.

#### ./bot_libs/bot.js
This file contains the function `twitterBotHandlerGenerator` which handles an Express request to the Twitter bot route (defined in `./server.js`)

#### ./bot_libs/puppeteer.js
This file contains the functions necessary to automatically extract the generated emoji reveal image and associated metadata from the puppeteer route for the Twitter bot.

#### ./bot_libs/twitter.js
This file contains the functions for uploading media and posting a Tweet.

### ./src
This folder contains the code and assets that will get [Webpacked](https://webpack.js.org/) for delivery to the user's browser. It's browser Javascript using Webpack's `import` anywhere syntax to break the functionality across multiple files.

#### ./src/client.*
The `client.*` files are files that are used to build the main page of the web app that users will see.

#### ./src/puppeteer.*
The `puppeteer.*` files are files that are used to build the page of the web app that a [headless `puppeteer` instance](https://github.com/GoogleChrome/puppeteer) of Chromium will use to retrieve the generated emoji image for the Twitter bot.

#### ./src/drawFuncs.js
This file contains all the functions that draw an image onto a [`<canvas>` context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)

#### ./src/emojiFuncs.js
This file contains helper functions focused on manipulating lists of emoji.

#### ./src/utils.js
This file contains miscellaneous helper functions for other files to import when needed.

#### ./src/emoji.json
This file is a JSON array of all the fully-qualified emoji from Unicode 11.0 and is the source of the emoji code points and descriptions that this app uses. It is an array of objects with the properties `char` (Unicode string of the emoji) and `descr` (the emoji's offical description in lower-case). This file is generated using the `./emoji_test_extractor.py` script from Unicode's [emoji-test.txt](https://unicode.org/Public/emoji/11.0/emoji-test.txt) file.

### ./emoji_test_extractor.py
A Python script used for creating a JSON file of all fully-qualified emoji from the Unicode 11.0 [emoji-test.txt](https://unicode.org/Public/emoji/11.0/emoji-test.txt) file. Depends on [`requests`](https://pypi.org/project/requests/).

### ./server.js
The Express routing server, the origin of all the behavior of this app. Defines 3 routes:
1. A main route `/` which returns the main app page.
2. A puppeteer route `/puppeteer` which returns a simplified app suitable for automated retrieval
3. A tweeting route, defined by the `tweetEndpoint` environment variable in `./.env`, which causes a tweet to be posted to the configured Twitter account.

### ./.env
See [Twitter bot usage](#twitter-bot-usage)

## Install from GitHub
```
git clone https://github.com/noahleigh/emoji-gender-reveal.git
cd emoji-gender-reveal
```
Specify the port you want it to run on in a `./.env` file like:
```
PORT=8080
```
Then
```
npm install
npm start
```
Once the build is complete and the server has started, open http://localhost:8080 (replace `8080` with whatever port you chose).


## Twitter bot usage
To use this as a Twitter bot, fill in the necessary information in a `.env` file in the project root.

Here is a sample `.env` template you can populate:
```
tweetEndpoint=

TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN_KEY=
TWITTER_ACCESS_TOKEN_SECRET=
```

- `tweetEndpoint` is the route that when visited, will trigger a tweet to be posted. If you're hosting this on a publically accessable server, you should use a hard-to-guess name to prevent abuse.
- For `TWITTER_*` values, see the [Authentication: Access Tokens](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens.html) guide on the Twitter developer documentation. Since this bot posts to an account, it needs a consumer to act on behalf of an account (the bot account).

Here's what that would look like filled out (with dummy values)
```
tweetEndpoint=k5jh32g5k2j

TWITTER_CONSUMER_KEY=weuyro234y2
TWITTER_CONSUMER_SECRET=sadGAS435DGAERgegsegASgAESg3
TWITTER_ACCESS_TOKEN_KEY=12342341235-sdgaEAFF3453DWF
TWITTER_ACCESS_TOKEN_SECRET=cxmnbvsljrdblmjhb43jhb452
```

Once these values are filled out, save the file and run `npm start` to start the server. HTTP GET requests to the `tweetEndpoint` you specified will post a tweet with an image and return a JSON object of the response from Twitter. If you want the bot to post automatically, you'll need to setup a [cron job](https://www.google.com/search?q=free+web+cron) to hit your server on a regular interval.

If you want to post **specific** emoji, use the `emoji` [query parameter](https://en.wikipedia.org/wiki/Query_string) by appending `?emoji=` to the end of your request, such as `/tweet?emoji=🤖`

## Credits
- [twemoji](https://github.com/twitter/twemoji) - Twitter's emoji image library
