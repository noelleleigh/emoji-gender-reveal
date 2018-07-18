# emoji-gender-reveal
Need a card for a gender reveal party? Emoji Gender Reveal has you covered with the latest in emoji gender technology!
Just click the card to randomly pick a new emoji gender!

## Install
```
git clone https://github.com/noahleigh/emoji-gender-reveal.git
cd emoji-gender-reveal
```
Specify the port you want it to run on in a `.env` file like:
```
PORT=8080
```
Then
```
npm install
npm start
```
Open http://localhost:8080

## Twitter bot usage
All you need to do to use this as a Twitter bot is to fill in the necessary information in a `.env` file in the project root.

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

Once these values are filled out, HTTP GET requests to the endpoint route you specified will post a tweet with an image and return that image. If you want the bot to post automatically, you'll need to setup a [cron job](https://www.google.com/search?q=free+web+cron) to hit your server on a regular interval.

## Libraries used
- [twemoji](https://github.com/twitter/twemoji) - Twitter's emoji image library
