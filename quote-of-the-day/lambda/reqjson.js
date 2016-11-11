'use strict';

const request = require('request');

module.exports.getJSON = (url) => {
  const promise = new Promise((resolve, reject) => {
    request.get(url, (err, res, body) => {
      if (err) {
        return reject(err);
      }

      resolve(JSON.parse(body));
    });
  });
  return promise;
};
