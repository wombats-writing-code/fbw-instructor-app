// customized fetch version with signing for QBank
'use strict';

var QBankSignature = require('../signingUtil/QBankSignature');
var credentials = require('../../common/constants/qbank_credentials');

var qbank = new QBankSignature();

let URL = 'https://' + credentials.Host + '/api/v2/';


var qbankFetch = function (params, _callback) {
    // wrapper around global fetch to include signing
    var now = new Date(),
        headers = new Headers(),
        url = URL + params.path,
        headerPath = url.split('mit.edu')[1],
        options, fetchInit;
    if (url.indexOf('%3A') >= 0) {
        url = decodeURIComponent(url);
        headerPath = decodeURIComponent(headerPath);
    }
    headers.append('x-api-key', credentials.AccessKeyId);
    headers.append('x-api-proxy', params.proxy ? params.proxy : credentials.Proxy);
    headers.append('host', credentials.Host);
    headers.append('request-line', headerPath);
    headers.append('accept', 'application/json');
    headers.append('date', now.toUTCString());
    options = {
        path: headerPath,
        method: params.hasOwnProperty('method') ? params.method : 'GET',
        headers: {
          'request-line': headers.get('request-line'),
          'accept': headers.get('accept'),
          'date': now.toUTCString(),
          'host': headers.get('host'),
          'x-api-proxy': headers.get('x-api-proxy')
        },
        body: '',
        credentials
    };
    qbank.setParams(options);

    headers.append('authorization', qbank.getAuthorizationString());

    fetchInit = {
        headers: headers,
        method: options.method.toUpperCase()
    };

    if (params.hasOwnProperty('data')) {
      if (typeof params.date == "string") {
        fetchInit['body'] = params.data;
      } else {
        fetchInit['body'] = JSON.stringify(params.data);
        headers.append('Content-Type', 'application/json');
      }
    }
    fetch(url, fetchInit)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (responseData) {
                    _callback(responseData);
                });
            } else {
                response.text().then(function (responseText) {
                    console.log('Not a 200 response: ' + url);
                    console.log('Error returned: ' + responseText);
                });
            }
        })
        .catch(function (error) {
            console.log('Error fetching: ' + url);
            console.log('Error with fetch! ' + error.message);
        });
};

module.exports = qbankFetch;