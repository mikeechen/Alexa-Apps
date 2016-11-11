'use strict';

var AlexaSkill = require('./AlexaSkill');
var https = require('https');
var APP_ID = undefined;
var SKILL_NAME = 'pokeedex';
var url = 'https://pokeapi.co/api/v2/pokemon/';
var speechOutput = '';

var Poke = function () {
    AlexaSkill.call(this, APP_ID);
};

Poke.prototype = Object.create(AlexaSkill.prototype);
Poke.prototype.constructor = Poke;


Poke.prototype.eventHandlers.onLaunch = function (intent, session, response) {
    launchRequest(response);
};


Poke.prototype.intentHandlers = {
    "PokemonIntent": function (intent, session, response) {
        pokeFacts(intent, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say tell me a fact about a certain pokemon, or tell me about a pokemon. What can I help you with?", "What can I help you with?");
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

function launchRequest(response) {
  var speechOutput = 'Welcome to ' + SKILL_NAME + '. Please say a pokemon\'s name to learn more about it.';
  response.ask(speechOutput);
}

function pokeFacts(intent, response) {
  var pokemon = intent.slots.pokemon;
  var pokemonName = '';
  if (pokemon && pokemon.value) {
    pokemonName = pokemon.value.toString().toLowerCase();
    if (pokemonName === 'pikachū') {
      pokemonName = 'pikachu';
    }
  }

  if (pokemonName) {
    var pokemonUrl = url + pokemonName + '/';
    var data = '';
    https.get(pokemonUrl, function (res) {
      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', function () {
        var parsedData = JSON.parse(data);
        var pokemonData = {
          id: parsedData.id,
          name: parsedData.name,
          abilities: parsedData.abilities,
          stats: parsedData.stats,
          weight: parsedData.weight / 10,
          height: parsedData.height / 10,
          types: parsedData.types
        };
        var typeSummary = '';
        var abilitySummary = '';
        var hiddenAbilitySummary = '';
        var statsSummary = '';

        if (pokemonData.types.length === 1) {
          typeSummary = pokemonData.types[0].type.name;
        } else {
          typeSummary = pokemonData.types[0].type.name + ' and ' + pokemonData.types[1].type.name;
        }

        var hiddenAbility = pokemonData.abilities.filter(function (elm) {
          return elm.is_hidden;
        });
        var nonHiddenAbility = pokemonData.abilities.filter(function (elm) {
          return !elm.is_hidden;
        });

        if (nonHiddenAbility.length !== 0) {
          if (nonHiddenAbility.length === 1) {
            abilitySummary = 'an ability of ' + nonHiddenAbility[0].ability.name;
          } else {
            abilitySummary = 'abilities of ';
            for (var i = 0; i < nonHiddenAbility.length - 1; i++) {
              abilitySummary = abilitySummary + nonHiddenAbility[i].ability.name + ', ';
            }
            abilitySummary = abilitySummary + 'and ' + nonHiddenAbility[nonHiddenAbility.length - 1].ability.name + '.';
          }
        }

        if (hiddenAbility.length !== 0) {
          if (hiddenAbility.length === 1) {
            hiddenAbilitySummary = 'a hidden ability of ' + hiddenAbility[0].ability.name;
          } else {
            hiddenAbilitySummary = 'hidden abilities of ';
            for (i = 0; i < hiddenAbility.length - 1; i++) {
              hiddenAbilitySummary = hiddenAbilitySummary + hiddenAbility[i].ability.name + ', ';
            }
            hiddenAbilitySummary = hiddenAbilitySummary + 'and ' + hiddenAbility[hiddenAbility.length - 1].ability.name;
          }
        }

        for (i = 0; i < pokemonData.stats.length - 1; i++) {
          statsSummary += pokemonData.stats[i].stat.name + ': ' + pokemonData.stats[i].base_stat + ', ';
        }
        statsSummary += 'and ' + pokemonData.stats[pokemonData.stats.length - 1].stat.name + ': '
                    + pokemonData.stats[pokemonData.stats.length - 1].base_stat + '.';

        speechOutput = pokemonData.name + ', pokeedex entry number '
          + pokemonData.id + '. It is observed to be '  + pokemonData.height + ' meters tall, and weighs '
          + pokemonData.weight + ' kilograms. ' + pokemonData.name + ' is a ' + typeSummary + ' type pokemon, with '
          + abilitySummary + ' and ' + hiddenAbilitySummary + '. This pokemon\'s base stats include the following: '
          + statsSummary;

        response.tell(speechOutput);
      });
    })
    .on('error', function (err) {
      speechOutput = 'NOPE!';

      response.tell(speechOutput);
    });
  } else {
    speechOutput = 'I can\'t seem to find the information you\'re looking for..';
    response.tell(speechOutput);
  }
}

exports.handler = function (event, context) {
    var quote = new Poke();
    quote.execute(event, context);
};
