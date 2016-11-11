'use strict';

var AlexaSkill = require('./AlexaSkill');
var request = require('./reqjson');
var getJSON = request.getJSON;
var https = require('https');
var APP_ID = undefined;
var SKILL_NAME = 'Quote of the day';

var Quote = function () {
    AlexaSkill.call(this, APP_ID);
};

Quote.prototype = Object.create(AlexaSkill.prototype);
Quote.prototype.constructor = Quote;

// Quote.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
//
// };

Quote.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    getQuote(response);
};

// Quote.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
//     //console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
//     // any cleanup logic goes here
// };

Quote.prototype.intentHandlers = {
    "GetQuoteIntent": function (intent, session, response) {
        getQuote(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say tell me a quote, or give me a quote. What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

function getQuote(response) {
  // getJSON('https://quotes.rest/qod.json')
  // .then(function(data) {
  //   var quoteObj = data.contents.quotes[0];
  //   var author = data.quoteObj.author;
  //   var quote = data.quoteObj.quote;
  //   var speechOutput = author + ' once said:' + quote;
  //   var cardTitle = 'Your Quote';
  //   response.tellWithCard(speechOutput, cardTitle, speechOutput);
  //   return;
  // })
  // .catch(function(err) {
  //   var errMessage = 'I\'m sorry, there was an error!';
  //   response.tell(err);
  //   return;
  // });
  var url = 'https://quotes.rest/qod.json';
  var body = '';
  https.get(url, function(res) {
    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      body = JSON.parse(body);
      var author = body.contents.quotes[0].author;
      var quote = body.contents.quotes[0].quote;
      var speechOutput = author + ' once said: ' + quote;
      response.tell(speechOutput);
    });
  }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

exports.handler = function (event, context) {
    var quote = new Quote();
    quote.execute(event, context);
};
