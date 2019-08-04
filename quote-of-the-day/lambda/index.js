'use strict';

var AlexaSkill = require('./AlexaSkill');
var https = require('https');
var APP_ID = undefined;
var SKILL_NAME = 'Quote of the day';

var Quote = function () {
    AlexaSkill.call(this, APP_ID);
};

Quote.prototype = Object.create(AlexaSkill.prototype);
Quote.prototype.constructor = Quote;

Quote.prototype.eventHandlers.onLaunch = async function (launchRequest, session, response) {
    await getQuote(response);
};

Quote.prototype.intentHandlers = {
    "GetQuoteIntent": async function (intent, session, response) {
        await getQuote(response);
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

function httpGet() {
    return new Promise(((resolve, reject) => {
        var url = 'https://quotes.rest/qod.json';
        const request = https.request(url, (response) => {
            response.setEncoding('utf8');
            let returnData = '';

            response.on('data', (chunk) => {
                returnData += chunk;
            });

            response.on('end', () => {
                resolve(JSON.parse(returnData));
            });

            response.on('error', (error) => {
                reject(error);
            });
        });
        request.end();
    }));
}

async function getQuote(response) {
    const res = await httpGet();
    const author = res.contents.quotes[0].author;
    const quote = res.contents.quotes[0].quote;
    const speechOutput = author + ' once said: ' + quote;
    response.tell(speechOutput);
}

exports.handler = function (event, context) {
    var quote = new Quote();
    quote.execute(event, context);
};
