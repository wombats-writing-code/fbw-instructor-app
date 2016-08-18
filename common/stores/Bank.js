// bank store
var BankConstants = require('../constants/Bank');
var BankDispatcher = require('../dispatchers/Bank');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var Q = require('q');

var ActionTypes = BankConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;
var D2LMiddlware = require('../middleware/D2L');
var DepartmentGenus = BankConstants.GenusTypes.DEPARTMENT;
var SubjectGenus = BankConstants.GenusTypes.SUBJECT;
var TermGenus = BankConstants.GenusTypes.TERM;
var ACCId = BankConstants.SchoolBanks.ACC;

var credentials = require('../constants/credentials');
var qbankFetch = require('fbw-utils')(credentials).qbankFetch;

var UserStore = require('../stores/User');

var _banks = [];

var BankStore = _.assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT, _banks);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  aliasTerm: function (bankId, aliasId) {
    var aliasParams = {
      method: 'PUT',
      path: `assessment/banks/${bankId}`,
      data: {
        aliasId: D2LMiddlware.id(aliasId)
      }
    };
    return Q.all([qbankFetch(aliasParams)])
      .then((response) => {
        return response[0].json;
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log('error aliasing a term');
      })
      .done();
  },
  getOrCreateChildNode: function (parentId, nodeName, nodeGenus, callback) {
    // don't need to proxy users when creating banks
    let getBankParams = {
      path: `assessment/banks?genus_type_id=${nodeGenus}&display_name=${nodeName}`
    },
    newBank = {};
    return Q.all([qbankFetch(getBankParams)])
      .then((res) => {
        return res[0].json;
      })
      .then((bankData) => {
        if (bankData.data.count === 0) {
          // create the bank and add it as a child node
          var createParams = {
            method: 'POST',
            path: 'assessment/banks',
            data: {
              genusTypeId: nodeGenus,
              name: nodeName,
              description: "FbW node"
            }
          };
          return qbankFetch(createParams);
        } else {
          return Q.reject(bankData.data.results[0]);
        }
      })
      .then((res) => {
        return res.json;
      })
      .then((newBankData) => {
        // add as a hierarchy child
        var hierarchyParams = {
          path: `assessment/hierarchies/nodes/${parentId}/children`
        };
        newBank = newBankData;
        return qbankFetch(hierarchyParams);
      })
      .then((res) => {
        return res.json;
      })
      .then((currentChildrenData) => {
        var currentChildrenIds = _.map(currentChildrenData.data.results, 'id'),
          addChildParams = {
            method: 'POST',
            path: `assessment/hierarchies/nodes/${parentId}/children`,
            data: {
            }
          };
        currentChildrenIds.push(newBank.id);
        addChildParams.data.ids = currentChildrenIds;
        return qbankFetch(addChildParams);
      })
      .catch((error) => {
        console.log('error creating a child node');
      })
      .done(() => {
        return newBank;
      });
  },
  setBankAlias: function (data, callback) {
    // try to GET the alias first, to see if it already exists
    var params = {
        path: 'assessment/banks/' + D2LMiddlware.id(data.aliasId)
      },
      _this = this,
      newTermId = '';
    return Q.all([qbankFetch(params)])
      .then((res) => {
        return res[0].json;
      })
      .then((bankData) => {
        // the bank already exists, so return it
        return bankData.id;
      })
      .catch((error) => {
        // bank does not exist, create it -- first see if the
        // name exists, then we're just missing term.
        // Otherwise, create both bank and term.
        return _this.getOrCreateChildNode(ACCId, data.departmentName, DepartmentGenus)
          .then((departmentData) => {
            return _this.getOrCreateChildNode(departmentData.id, data.subjectName, SubjectGenus);
          })
          .then((subjectData) => {
            return _this.getOrCreateChildNode(subjectData.id, data.termName, TermGenus);
          })
          .then((termData) => {
            newTermId = termData.id;
            return _this.aliasTerm(termData.id, data.aliasId);
          })
          .then(() => {
            return newTermId;
          })
          .done();
      })
      .done();
  }
});

BankStore.dispatchToken = BankDispatcher.register(function (action) {
  switch(action.type) {
    case ActionTypes.SET_BANK_ALIAS:
      BankStore.setBankAlias(action.content, action.callback);
      break;
    default:
      // do nothing
  }
});

module.exports = BankStore;
