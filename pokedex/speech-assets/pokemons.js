'use strict';

const fs = require('fs');
const path = require('path');
const rp = require('request-promise');
const pokemonPath = path.join(__dirname, 'pokemons.txt');

rp('http://pokeapi.co/api/v2/pokemon/?limit=811')
.then((data) => {
  const parsedData = JSON.parse(data).results;
  parsedData.forEach((elm) => {
    fs.appendFile(pokemonPath, elm.name + '\n', (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return;
      }
      console.log(elm.name + ' is written in.');
    });
  });
})
.catch((err) => {
  console.error(err);
});
