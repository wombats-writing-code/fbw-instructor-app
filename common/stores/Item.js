// Item store

var ItemDispatcher = require('../dispatchers/Item');
var ItemConstants = require('../constants/Item');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var Q = require('q');

var credentials = require('../constants/credentials');
var qbankFetch = require('fbw-utils')(credentials).qbankFetch;

var ActionTypes = ItemConstants.ActionTypes;
var BankMap = ItemConstants.BankMap;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var GuessDepartmentCode = require('../../utilities/department/guessDepartmentCode');
var UserStore = require('./User');

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
  getItems: function () {
    var _this = this;
    UserStore.getDepartment()
      .then((department) => {
        var departmentCode = GuessDepartmentCode(department),
          params = {
            path: `assessment/banks/${BankMap[departmentCode]}/items?page=all`
          };
        Q.all([qbankFetch(params)])
          .then((res) => {
            return Q.all([res[0].json()]);
          })
          .then((data) => {
            if (typeof data[0] !== 'undefined') {
              _items = data[0].data.results;
              _this.emitChange();
            }
          })
          .catch((error) => {
            console.log('error getting items');
          })
          .done();
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
