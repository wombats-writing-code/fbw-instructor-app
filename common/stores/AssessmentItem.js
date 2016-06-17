// AssessmentItem store

var AssessmentItemDispatcher = require('../dispatchers/AssessmentItem');
var AssessmentItemConstants = require('../constants/AssessmentItem');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var qbankFetch = require('../../utilities/fetch/fetch');

var ActionTypes = AssessmentItemConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _items = [];

var AssessmentItemStore = _.assign({}, EventEmitter.prototype, {
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
  getItems: function (bankId, assessmentId) {
    var _this = this,
      params = {
        path: 'assessment/banks/' + bankId + '/assessments/' + assessmentId + '/items?page=all'
      };
    qbankFetch(params, function (data) {
      _items = data.data.results;
      _this.emitChange();
    });
  },
  setItems: function (data) {
    var _this = this,
      originalItems = data['items'],
      params = {
        data: data,
        method: 'PUT',
        path: 'assessment/banks/' + data.bankId + '/assessments/' + data.assessmentId + '/items'
      };

    params.data.itemIds = _.map(originalItems, 'id');
    _items = originalItems;
    this.emitChange();

    qbankFetch(params, function (responseData) {
      _this.getItems(data.bankId, data.assessmentId);
    });
  }
});

AssessmentItemStore.dispatchToken = AssessmentItemDispatcher.register(function (action) {
  switch(action.type) {
    case ActionTypes.SET_ITEMS:
      AssessmentItemStore.setItems(action.content);
      break;
    case ActionTypes.UPDATE_ASSESSMENT:
      AssessmentItemStore.updateAssessment(action.content);
      break;
    case ActionTypes.DELETE_ASSESSMENT:
      AssessmentItemStore.deleteAssessment(action.content);
      break;
  }
});

module.exports = AssessmentItemStore;