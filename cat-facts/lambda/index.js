'use strict';

var AlexaSkill = require('./AlexaSkill');
var https = require('https');
var APP_ID = undefined;
var SKILL_NAME = 'Cat facts';

var Cat = function () {
    AlexaSkill.call(this, APP_ID);
};

Cat.prototype = Object.create(AlexaSkill.prototype);
Cat.prototype.constructor = Cat;


Cat.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    catFacts(response);
};


Cat.prototype.intentHandlers = {
    "GetFactsIntent": function (intent, session, response) {
        catFacts(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say tell me a fact about cats, or give me a cat fact. What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Ok. I will shut up.";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

function catFacts(response) {
  var number  = Math.floor(Math.random() * 100 + 1);
  var url = 'https://catfacts-api.appspot.com/api/facts?number=' + number;
  var body = '';
  https.get(url, function(res) {
    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      body = JSON.parse(body);
      var fact = body.facts[Math.floor(Math.random() * number)];
      var speechOutput = 'Did you know that ' + fact;
      response.tell(speechOutput);
    });
  }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

exports.handler = function (event, context) {
    var quote = new Cat();
    quote.execute(event, context);
};
