// customized fetch version for Handcar authenticated calls
'use strict';

var credentials = require('../../common/constants/handcar_credentials');

let URL = 'https://' + credentials.Host + '/handcar/services';

var HandcarFetch = function (params, _callback) {
    // wrapper around global fetch to include signing
    var url = URL + params.path;
    
  if (url.indexOf('%3A') >= 0) {
    url = decodeURIComponent(url);
  }

  if (url.indexOf('?') >= 0) {
    url = url + '&proxyname=' + credentials.ProxyKey;
  } else {
    url = url + '?proxyname=' + credentials.ProxyKey;
  }

  fetch(url)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (responseData) {
          _callback(responseData);
        });
      } else {
        response.text().then(function (responseText) {
          console.log('Not a 200 response: ' + url);
          console.log('Error returned from Handcar: ' + responseText);
        });
      }
    })
    .catch(function (error) {
      console.log('Error fetching: ' + url);
      console.log('Error with handcar fetch! ' + error.message);
    });
};

module.exports = HandcarFetch;