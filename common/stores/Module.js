// Module store (Handcar)

var ModuleConstants = require('../constants/Module');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var Q = require('q');

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
    var _this = this,
      departments = ['accounting', 'algebra', 'cad'],
      departmentPromises = [];
    // let's change this to just get all outcomes ... that will cover the
    // future case when someone wants to pull in outcomes from another
    // department

    _.each(departments, (department) => {
      let params = {
        path: '/learning/objectivebanks/' + BankMap[department] + '/objectives/roots?descendentlevels=2'
      };
      departmentPromises.push(HandcarFetch(params));
    });
    Q.all(departmentPromises)
      .then((res) => {
        let modulePromises = [];
        _.each(res, (departmentRes) => {
          modulePromises.push(departmentRes.json());
        })
        return Q.all(modulePromises);
      })
      .then((data) => {
        _modules = [];
        _.each(data, (departmentData) => {
          _modules = _modules.concat(departmentData);
        });
        _.each(_modules, function (module) {
          _.each(module.childNodes, function (outcome) {
            _outcomes[outcome.id] = outcome;
          });
        });
        _this.emitChange();
      })
      .catch((error) => {
        console.log('error getting modules');
      })
      .done();
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
  },
  getOutcomes: function () {
    return _outcomes;
  }
});


module.exports = ModuleStore;
