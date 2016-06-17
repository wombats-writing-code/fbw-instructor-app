// Item store

var ItemDispatcher = require('../dispatchers/Item');
var ItemConstants = require('../constants/Item');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var qbankFetch = require('../../utilities/fetch/fetch');

var ActionTypes = ItemConstants.ActionTypes;
var BankMap = ItemConstants.BankMap;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _items = [];

var ItemStore = _.assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT, _items);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getItem: function (id) {
    return _.find(_items, function (item) {
      return item.id == id;
    });
  },
  getItems: function (bankId) {
    // console.log('getting items');

    var _this = this,
      params = {
        path: 'assessment/banks/' + BankMap[bankId] + '/items?page=all'
      };
    qbankFetch(params, function (data) {
      // console.log('fetched items');

      _items = data.data.results;
      _this.emitChange();
    });
  }
});

ItemStore.dispatchToken = ItemDispatcher.register(function (action) {
    switch(action.type) {
        case ActionTypes.CREATE_ASSESSMENT:
            ItemStore.createAssessment(action.content);
            break;
        case ActionTypes.UPDATE_ASSESSMENT:
            ItemStore.updateAssessment(action.content);
            break;
        case ActionTypes.DELETE_ASSESSMENT:
            ItemStore.deleteAssessment(action.content);
            break;
    }
});

module.exports = ItemStore;
