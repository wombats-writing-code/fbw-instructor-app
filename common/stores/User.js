// user store
// saves state for the given user
// use react-native-store to save these in the device

var UserDispatcher = require('../dispatchers/User');
var UserConstants = require('../constants/User');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var store = require('react-native-simple-store');

var D2LMiddlware = require('../middleware/D2L.js');

var ActionTypes = UserConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;


var UserStore = _.assign({}, EventEmitter.prototype, {
  enrollments: function (callback) {
    store.get('school')
      .then(function (school) {
        if (school === 'acc') {
          D2LMiddlware.enrollments(callback);
        }
      });
  },
  getBankId: function (callback) {
    store.get('bankId')
      .then(function (bankId) {
        callback(bankId);
      });
  },
  getSchool: function (callback) {
    store.get('school')
      .then(function (school) {
        callback(school);
    });
  },
  getUsername: function (callback) {
    store.get('username')
    .then(function (username) {
      callback(username);
    })
  },
  hasSession: function (callback) {
    store.get('school')
      .then(function (school) {
        if (school === 'qcc') {
        } else {
          D2LMiddlware.hasSession(callback);
        }
    });
  },
  setBankId: function (payload) {
    store.save('bankId', payload.bankId);
  },
  setAuthenticationUrlD2L: function (d2lURL) {
    D2LMiddlware.setAuthenticationUrl(d2lURL);
  },
  setSchool: function (school) {
    store.save('school', school);
  },
  setUsername: function (callback) {
    store.get('school')
      .then(function (school) {
        if (school === 'acc') {
          D2LMiddlware.whoAmI(function (user) {
            store.save('username', user.UserName)
            .then(callback);
          });
        }
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
