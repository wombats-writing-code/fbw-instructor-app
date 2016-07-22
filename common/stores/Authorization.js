// Authorization store

var AuthorizationDispatcher = require('../dispatchers/Authorization');
var AuthorizationConstants = require('../constants/Authorization');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var credentials = require('../constants/credentials');
var fbwUtils = require('fbw-utils')(credentials);

var ConvertDate2Dict = fbwUtils.ConvertDateToDictionary;
var qbankFetch = fbwUtils.qbankFetch;

var BaseBanks = AuthorizationConstants.BaseBanks;
var InstructorAuthorizationFunctions = AuthorizationConstants.InstructorAuthorizationFunctions;

var _data = {};

var AuthorizationStore = _.assign({}, EventEmitter.prototype, {
  hasAuthorizations: function (data, callback) {
    // data should include username and the schoolId (acc or qcc)
    var url = 'assessment/banks/' + credentials.qbank.SchoolNodes[data.schoolId] + '/items',
      params = {
        path: url,
        proxy: data.username
      };

    qbankFetch(params, function (response) {
      callback(true);
    }, function (response) {
      // indicates a non-200 response from QBank
      callback(false);
    });
  },
  setAuthorizations: function (data, callback) {
    // data should include username and the schoolId (acc or qcc)
    var qualifierIds = BaseBanks,
      schoolNodeId = credentials.qbank.SchoolNodes[data.schoolId],
      now = new Date(),
      endDate = ConvertDate2Dict(now),
      params = {
      data: {
        bulk: []
      },
      method: 'POST',
      path: 'authorization/authorizations'
    };

    endDate.month = endDate.month + 6;

    if (endDate.month > 12) {
      endDate.month = endDate.month - 12;
      endDate.year++;
    }

    if (endDate.month == 2 && endDate.date > 28) {
      endDate.date = 28;
    }

    if ([4, 6, 9, 11].indexOf(endDate.month) >= 0 && endDate.date == 31) {
      endDate.date = 30;
    }

    qualifierIds = qualifierIds.concat([schoolNodeId]);
    _.each(qualifierIds, function (qualifierId) {
      _.each(InstructorAuthorizationFunctions, function (functionId) {
        params.data.bulk.push({
          agentId: data.username,
          endDate: endDate,
          functionId: functionId,
          qualifierId: qualifierId
        });
      });
    });
    
    qbankFetch(params, function (response) {
      callback();
    });
  }
});

AuthorizationStore.dispatchToken = AuthorizationDispatcher.register(function (action) {
    switch(action.type) {
        case ActionTypes.SET_AUTHORIZATIONS:
            AuthorizationStore.setAuthorizations(action.content);
            break;
    }
});

module.exports = AuthorizationStore;
