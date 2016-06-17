// Module store (Handcar)

var ModuleConstants = require('../constants/Module');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var HandcarFetch = require('../../utilities/handcar/fetch');

var ActionTypes = ModuleConstants.ActionTypes;
var BankMap = ModuleConstants.BankMap;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;
var GenusTypes = ModuleConstants.GenusTypes;

var _modules = [];
var _outcomes = {};

var ModuleStore = _.assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT, _modules);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getModule: function (id) {
    return _.find(_modules, function (module) {
      return module.id == id;
    });
  },
  getModules: function (bankId) {
    var _this = this,
      params = {
        path: '/learning/objectivebanks/' + BankMap[bankId] + '/objectives/roots?descendentlevels=2'
      };
    HandcarFetch(params, function (data) {
      _modules = data;
      _.each(_modules, function (module) {
        _.each(module.childNodes, function (outcome) {
          _outcomes[outcome.id] = outcome;
        });
      });

      _this.emitChange();
    });
  },
  getOutcome: function (outcomeId) {
    if (_.keys(_outcomes).indexOf(outcomeId) >= 0) {
      return _outcomes[outcomeId];
    } else {
      return {
        displayName: {
          text: 'Unknown LO'
        }
      }
    }
  }
});


module.exports = ModuleStore;
