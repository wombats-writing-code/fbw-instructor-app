// account store
// use react-native-store to save these in the device

var AccountDispatcher = require('../dispatchers/Account');
var AccountConstants = require('../constants/Account');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash');

var qbankFetch = require('../../utilities/fetch/fetch');

var ActionTypes = AccountConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;


var AccountsDB = AccountConstants.DB.account;

var _data = [];

var AccountsStore = assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit(CHANGE_EVENT, _data);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    addUserAccount: function (data) {

    },
    getUserAccounts: function () {
        var _this = this;
        AccountsDB.find().then(function (data) {
            _data = data;
            _this.emitChange();
        })
        .catch(function (error) {
            console.log(error);
        });
    }
});

AccountsStore.dispatchToken = AccountDispatcher.register(function (action) {
    switch(action.type) {
        case ActionTypes.CREATE_OBJECTIVE:
            ObjectiveStore.createObjective(action.content);
            break;
        case ActionTypes.UPDATE_OBJECTIVE:
            ObjectiveStore.updateObjective(action.content);
            break;
        case ActionTypes.DELETE_OBJECTIVE:
            ObjectiveStore.deleteObjective(action.content);
            break;
    }
});

module.exports = AccountsStore;