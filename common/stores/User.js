// user store
// saves state for the given user
// use react-native-store to save these in the device

var UserDispatcher = require('../dispatchers/User');
var UserConstants = require('../constants/User');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var credentials = require('../constants/credentials');
var fbwUtils = require('fbw-utils')(credentials);

var qbankFetch = fbwUtils.qbankFetch;

var ActionTypes = UserConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _data = {};

var UserStore = _.assign({}, EventEmitter.prototype, {
  enrollments: function (callback) {
    this._fetch('/d2l/api/lp/1.9/enrollments/myenrollments/', 'GET', callback);
  },
  getData: function () {
//        return _data;
    return {
      bankId: 'assessment.Bank%3A57279fc9e7dde086c7fe2102%40bazzim.MIT.EDU'  // CAD1 Spring 2017
    }
  },
  setBankId: function (payload) {
      console.log('bankId saved to user store');
      _data['bankId'] = payload.bankId;
  },
  setContext: function (userContext) {
    _data['context'] = userContext;
  },
  whoAmI: function (callback) {
    this._fetch('/d2l/api/lp/1.5/users/whoami', 'GET', callback);
  },
  _fetch: function (path, method, callback) {
    let authenticatedUrl = _data.context.createAuthenticatedUrl(path, method),
      params = {};
    if (method != 'GET') {
      params.method = method;
    }
    fetch(authenticatedUrl, params)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
            callback(data);
          });
        } else {
          response.text().then(function (data) {
            console.log("response text: " + data);
            console.log(response.status);
          });
        }
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }
});

UserStore.dispatchToken = UserDispatcher.register(function (action) {
    switch(action.type) {
        case ActionTypes.BANK_SELECTED:
            UserStore.setBankId(action.content);
            break;
    }
});

module.exports = UserStore;