// bank store
var BankConstants = require('../constants/Bank');
var BankDispatcher = require('../dispatchers/Bank');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var ActionTypes = BankConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;
var D2LMiddlware = require('../middleware/D2L');
var DepartmentGenus = BankConstants.GenusTypes.DEPARTMENT;
var SubjectGenus = BankConstants.GenusTypes.SUBJECT;
var TermGenus = BankConstants.GenusTypes.TERM;
var ACCId = BankConstants.SchoolBanks.ACC;

var credentials = require('../constants/credentials');
var fbwUtils = require('fbw-utils')(credentials);
var qbankFetch = fbwUtils.qbankFetch;

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
  aliasTerm: function (bankId, aliasId, callback) {
    UserStore.getUsername(function (username) {
      var aliasParams = {
        method: 'PUT',
        path: `assessment/banks/${bankId}`,
        data: {
          aliasId: D2LMiddlware.id(aliasId)
        },
        proxy: username
      };
      qbankFetch(aliasParams, callback);
    });
  },
  getOrCreateChildNode: function (parentId, nodeName, nodeGenus, callback) {
    UserStore.getUsername(function (username) {
      var getBankParams = {
        path: `assessment/banks?genus_type_id=${nodeGenus}&display_name=${nodeName}`
      };
      qbankFetch(getBankParams, function (bankData) {
        if (bankData.data.count === 0) {
          // create the bank and add it as a child node
          var createParams = {
            method: 'POST',
            path: 'assessment/banks',
            data: {
              genusTypeId: nodeGenus,
              name: nodeName,
              description: "FbW node"
            },
            proxy: username
          };
          qbankFetch(createParams, function (newBankData) {
            // add as a hierarchy child
            var hierarchyParams = {
              path: `assessment/hierarchies/nodes/${parentId}/children`
            };
            qbankFetch(hierarchyParams, function (currentChildrenData) {
              var currentChildrenIds = _.map(currentChildrenData.data.results, 'id'),
                addChildParams = {
                  method: 'POST',
                  path: `assessment/hierarchies/nodes/${parentId}/children`,
                  data: {
                  },
                  proxy: username
                };
                currentChildrenIds.push(newBankData.id);
                addChildParams.data.ids = currentChildrenIds;
                qbankFetch(addChildParams, function (childAddedData) {
                  callback(newBankData);
                });
            });
          });
        } else {
          // child bank exists (and we assume as a child node)
          // return it
          callback(bankData.data.results[0]);
        }
      });
    });
  },
  setBankAlias: function (data) {
    // try to GET the alias first, to see if it already exists
    console.log('setting aliases');
    var params = {
        path: 'assessment/banks/' + D2LMiddlware.id(data.aliasId)
      },
      _this = this;
    qbankFetch(params, function (bankData) {
      // the bank already exists, so return it
      data.callback(bankData.id);
    }, function (error) {
      // bank does not exist, create it -- first see if the
      // name exists, then we're just missing term.
      // Otherwise, create both bank and term.
      console.log("Let's create the bank ... check if the department exists, first.");
      _this.getOrCreateChildNode(ACCId, data.departmentName, DepartmentGenus, function (departmentData) {
        _this.getOrCreateChildNode(departmentData.id, data.subjectName, SubjectGenus, function (subjectData) {
          _this.getOrCreateChildNode(subjectData.id, data.termName, TermGenus, function (termData) {
            _this.aliasTerm(termData.id, data.aliasId, function () {
              data.callback(termData.id);
            });
          });
        });
      });
    });
  }
});

BankStore.dispatchToken = BankDispatcher.register(function (action) {
  switch(action.type) {
    case ActionTypes.SET_BANK_ALIAS:
      BankStore.setBankAlias(action.content);
      break;
    default:
      // do nothing
  }
});

module.exports = BankStore;
