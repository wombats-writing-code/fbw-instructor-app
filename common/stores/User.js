// user store
// saves state for the given user
// use react-native-store to save these in the device

var UserDispatcher = require('../dispatchers/User');
var UserConstants = require('../constants/User');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var qbankFetch = require('../../utilities/fetch/fetch');

var ActionTypes = UserConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _data = {};

var UserStore = _.assign({}, EventEmitter.prototype, {
    getData: function () {
//        return _data;
      return {
        bankId: 'assessment.Bank%3A57279fc9e7dde086c7fe2102%40bazzim.MIT.EDU'  // CAD1 Spring 2017
      }
    },
    setBankId: function (payload) {
        console.log('bankId saved to user store');
        _data['bankId'] = payload.bankId;
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