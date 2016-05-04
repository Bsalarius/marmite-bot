var restclient = require('node-restclient');
var Twit = require('twit');
var async = require('async');

// Put your Twitter App Details here :D
var T = new Twit({
  consumer_key:         '',
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  ''
});


// Favourites any retweets
function favRTs () {
  T.get('statuses/retweets_of_me', {}, function (e,r) {
    for(var i=0;i<r.length;i++) {
      T.post('favorites/create/'+r[i].id_str,{},function(){});
    }
    console.log('RTs fave\'d'); 
  });
}


// Function to read a file, simple
function readFile() {
  var fs = require("fs");
  var contents = fs.readFileSync(__dirname+"/latest", "utf8");
  return contents;
}

// Gets tweets and runs the bot (LEGACY FUNCTION NAME TOO LAZY TO CHANGE)
function getTweets(user) {
  var options = { screen_name: user,
                  count: 1 };

  T.get('statuses/user_timeline', options , function gotData(err, data) {
    var fs = require('fs');
    for (var i = 0; i < data.length ; i++) {
      var fs = require('fs');
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
            changeText = changeText.replace(new RegExp(escapeRegExp("a"), 'g'), "u");
            changeText = changeText.replace(new RegExp(escapeRegExp("e"), 'g'), "u");
            changeText = changeText.replace(new RegExp(escapeRegExp("i"), 'g'), "u");
            changeText = changeText.replace(new RegExp(escapeRegExp("o"), 'g'), "u");
            changeText = changeText.replace(new RegExp(escapeRegExp("A"), 'g'), "U");
            changeText = changeText.replace(new RegExp(escapeRegExp("E"), 'g'), "U");
            changeText = changeText.replace(new RegExp(escapeRegExp("I"), 'g'), "U");
            changeText = changeText.replace(new RegExp(escapeRegExp("O"), 'g'), "U");

            recon += changeText;
          }
          // Add spaces back to tweet
          recon += " ";
        }

        // Join array back into a string
        recon = recon.replace("undefined", "");
        ttt = recon.slice(0, -1);

        // Post the tweet
        T.post('statuses/update', { status: '"'+ttt+'" @'+user }, function(err, data, response) {
          console.log(data)
        })
      }
      // Save the tweet to check against later
      fs.writeFile(__dirname+"/latest", msg, function(err) {
        if(err) {
          return console.log(err);
        }
        var d = new Date();
        console.log('[' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '] Bot ran successfully!');
      });
    }
  });
}


//  ||
//  ||
//  ||
//  ||
//  ||
//  \/

// PUT YOUR TWITTER NAME HERE
function doLoop() {
  getTweets('');
}

//  /\
//  ||
//  ||
//  ||
//  ||
//  ||


/*
  Every 2 minutes, run the script wrapped in
  a try/catch in case Twitter is unresponsive, 
  don't really care about error handling. 
  It just won't tweet.
*/
setInterval(function() {
  try {
    doLoop();
  }
 catch (e) {
    console.log(e);
  }
},5000);

// Every 5 hours, check for retweets, and fave them ;)
setInterval(function() {
  try {
    favRTs();
  }
 catch (e) {
    console.log(e);
  }
},60000*60*5);