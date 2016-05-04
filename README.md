# Marmite Bot
## Introduction
Marmite Bot is a Twitter Bot designed to listen to a user, and tweet what they said, albeit with some modifications.

## Usage
---
### Installation
To download the bot, simply clone this repository to your system.

`git clone https://github.com/lolPants/marmite-bot.git`

And then install Node.JS Dependencies with

`npm install`

### Setup
Place your Twitter App Keys in the area at the top of `marmite.js`

```
// Put your Twitter App Details here :D
var T = new Twit({
  consumer_key:         '',
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  ''
});
```

---

Then place the username of the user you want the bot to listen to in the `doLoop()` function.

Example:

```
// PUT YOUR TWITTER NAME HERE
function doLoop() {
  getTweets('jackbaronlp');
}
```
### Running
To run the bot once installed and set up, just make sure you are in the directory and run: `node .`

Is is best if you run this in a virtual window (eg: Screen or TMux)

---
## Credits
- Jack Baron (Code)
- DerpyChap (Idea / Moral Support)
