var restclient = require('node-restclient');
var fs = require("fs");
var Twit = require('twit');
var conf = require('./config');

// Put your Twitter App Details in the config.js file :D
var T = new Twit(conf.twit_conf);

function log(msg) {
  console.log('[' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ']' + msg);
}

// Favourites any retweets
function favRTs() {
  T.get('statuses/retweets_of_me', {}, function (e,r) {
    for(var i = 0; i < r.length; i++) {
      T.post('favorites/create/' + r[i].id_str, {}, function () {});
    }
    log('RTs fave\'d'); 
  });
}

// Function to read a file, simple
function readFile() {
  var contents = fs.readFileSync(__dirname + "/latest", "utf8");
  return contents;
}

// Gets tweets and runs the bot (LEGACY FUNCTION NAME TOO LAZY TO CHANGE)
function getTweets(user) {
  var options = { screen_name: user,
                  count: 1 };

  T.get('statuses/user_timeline', options, function (err, data) {
    for (var i = 0; i < data.length ; i++) {
      var msg = data[i].text;
      if (data[i].text == readFile()) {
        //The Tweet is the same

        // Do nothing
        // ¯\_(ツ)_/¯
      } else {
        // The Tweet is Different

        // Vowel Replacement
        function escapeRegExp(str) {
          return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }

        //Define TextToTweet
        var ttt = msg;
        var arr = ttt.split(" ");
        var recon;

        // Scan tweet content
        // Determine type of word.
        for (var i = 0, len = arr.length; i < len; i++) {
          if (arr[i].substring(0,1) == "@") {
            // Mention (DO NOT CHANGE)
            recon += arr[i];
          } else if (arr[i].substring(0,1) == "#") {
            // Hashtag (DO NOT CHANGE)
            recon += arr[i];
          } else if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(arr[i])) {
            // Link (DO NOT CHANGE)
            recon += arr[i];
          } else {
            // Regular Word (DO WHATEVER THE FUCK YOU WANT)
            changeText = arr[i];

            // Modify Text
            var changeChars = {
              'a': 'u',
              'e': 'u',
              'i': 'u',
              'o': 'u',
              'A': 'U',
              'E': 'U',
              'I': 'U',
              'O': 'U'
            };
            for (var k = 0; k < changeChars.length; k++) {
              var changeFrom = Object.keys(changeChars)[k];
              var changeTo = changeChars[k];
              changeText = changeText.replace(new RegExp(escapeRegExp(changeFrom), 'g'), changeTo);
            }

            recon += changeText;
          }
          // Add spaces back to tweet
          recon += " ";
        }

        // Join array back into a string
        recon = recon.replace("undefined", "");
        ttt = recon.slice(0, -1);

        // Post the tweet
        T.post('statuses/update', { status: '"' + ttt + '" @' + user }, function(err, data, response) {
          log(data);
        })
      }
      // Save the tweet to check against later
      fs.writeFile(__dirname + "/latest", msg, function(err) {
        if (err) {
          return log(err);
        }
        var d = new Date();
        log('Bot ran successfully!');
      });
    }
  });
}

function doLoop() {
  for (var i = 0; i < conf.twitter_usernames; i++) {
    getTweets(conf.twitter_usernames[i]);
  }
}

/*
  Every 2 minutes, run the script wrapped in
  a try/catch in case Twitter is unresponsive, 
  don't really care about error handling. 
  It just won't tweet.
*/
setInterval(function() {
  try {
    doLoop();
  } catch (e) {
    log(e);
  }
}, 5000);

// Every 5 hours, check for retweets, and fave them ;)
setInterval(function() {
  try {
    favRTs();
  } catch (e) {
    log(e);
  }
}, 60000 * 60 * 5);