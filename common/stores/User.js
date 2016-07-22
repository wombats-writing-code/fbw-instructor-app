// user store
// saves state for the given user
// use react-native-store to save these in the device
import {
  Actions
} from "react-native-router-flux";

var UserDispatcher = require('../dispatchers/User');
var UserConstants = require('../constants/User');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var store = require('react-native-simple-store');

var AuthorizationStore = require('./Authorization');
var D2LMiddlware = require('../middleware/D2L.js');

var ActionTypes = UserConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;


var UserStore = _.assign({}, EventEmitter.prototype, {
  clearUserContext: function (callback) {
    store.get('school')
      .then(function (school) {
        if (school === 'acc') {
          D2LMiddlware.clearUserContext();
        }
        callback();
      });
  },
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
          store.delete('school');
          Actions.login();
        } else {
          D2LMiddlware.hasSession((hasSession) => {
            console.log('has session? ' + hasSession);
            if (hasSession) {
              callback(hasSession);
            } else {
              UserStore.clearUserContext(() => {
                console.log('cleared context')
                callback(false)
              });
            }
          });
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
            var username = user.UniqueName.indexOf('@') >= 0 ? user.UniqueName : `${user.UniqueName}@acc.edu`;

            store.save('username', username)
              .then(function () {
                // also create the QBank authorizations here
                var payload = {
                  schoolId: school,
                  username: username
                };
                console.log(username);
                AuthorizationStore.hasAuthorizations(payload,
                  function (hasAuthz) {
                    console.log('checking qbank authz: ' + hasAuthz);
                    if (hasAuthz) {
                      callback();
                    } else {
                      Actions.initializeQbank(
                        {
                          payload: payload,
                          callback: callback
                        });
                    }
                });
              });
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
