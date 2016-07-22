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
  getBankId: function () {
    return store.get('bankId');
  },
  getDepartment: function () {
    return store.get('department');
  },
  getSchool: function () {
    return store.get('school');
  },
  getUsername: function () {
    return store.get('username');
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
                callback(false);
              });
            }
          });
        }
    });
  },
  setAuthenticationUrlD2L: function (d2lURL) {
    D2LMiddlware.setAuthenticationUrl(d2lURL);
  },
  setBankId: function (payload) {
    store.save('bankId', payload.bankId);
  },
  setDepartment: function (department) {
    store.save('department', department);
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

                AuthorizationStore.hasAuthorizations(payload,
                  function (hasAuthz) {
                    if (hasAuthz) {
                      callback();
                    } else {
                      console.log('initializing qbank');
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
