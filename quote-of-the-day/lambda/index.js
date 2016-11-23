'use strict';

var AlexaSkill = require('./AlexaSkill');
var https = require('https');
var axios = require('axios');
var APP_ID = undefined;
var SKILL_NAME = 'Quote of the day';

var Quote = function () {
    AlexaSkill.call(this, APP_ID);
};

Quote.prototype = Object.create(AlexaSkill.prototype);
Quote.prototype.constructor = Quote;

Quote.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    getQuote(response);
};

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
  var url = 'http://quotes.rest/qod.json';
  axios(url)
    .then(function(res) {
      var author = res.data.contents.quotes[0].author;
      var quote = res.data.contents.quotes[0].quote;
      var speechOutput = author + ' once said: ' + quote;
      response.tell(speechOutput);
    })
    .catch(function(err) {
      console.log("Got error: ", err);
    });
}

exports.handler = function (event, context) {
    var quote = new Quote();
    quote.execute(event, context);
};
