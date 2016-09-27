// Module store (Handcar)

var ModuleConstants = require('../constants/Module');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var credentials = require('../constants/credentials');
var HandcarFetch = require('fbw-utils')(credentials).handcarFetch;

var ActionTypes = ModuleConstants.ActionTypes;
var BankMap = ModuleConstants.BankMap;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;
var GenusTypes = ModuleConstants.GenusTypes;

var GuessDepartmentCode = require('../../utilities/department/guessDepartmentCode');
var UserStore = require('./User');

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
  getModules: function () {
    var _this = this;
    UserStore.getDepartment()
      .then((department) => {
        var departmentCode = GuessDepartmentCode(department),
          params = {
            path: '/learning/objectivebanks/' + BankMap[departmentCode] + '/objectives/roots?descendentlevels=2'
          };

        return HandcarFetch(params);
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        _modules = data;
        _.each(_modules, function (module) {
          _.each(module.childNodes, function (outcome) {
            _outcomes[outcome.id] = outcome;
          });
        });
        // console.log(' modules', _modules);

        _this.emitChange();
      })
      .catch((error) => {
        console.log('error getting modules');
      })
      .done();
  },
  getOutcome: function (outcomeId) {
    return _outcomes[outcomeId];
  },
  getOutcomes: function () {
    return _outcomes;
  }
});


module.exports = ModuleStore;
