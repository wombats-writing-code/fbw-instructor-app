// user store
// saves state for the given user
// use react-native-store to save these in the device

var UserDispatcher = require('../dispatchers/User');
var UserConstants = require('../constants/User');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var store = require('react-native-simple-store');

var credentials = require('../constants/credentials');
var fbwUtils = require('fbw-utils')(credentials);
var D2L = require('valence');
var AppContext = new D2L.ApplicationContext(credentials.d2l.appID, credentials.d2l.appKey);

var qbankFetch = fbwUtils.qbankFetch;

var ActionTypes = UserConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _data = {};

var UserStore = _.assign({}, EventEmitter.prototype, {
  enrollments: function (callback) {
    // need to get all of these, because paginated
    var url = '/d2l/api/lp/1.9/enrollments/myenrollments/',
      bookmark = '',
      enrollments = [],
      hasMoreItems = true,
      _this = this;

    function getNextPage () {
      console.log('getting enrollments');
      _this._fetch(url + '?bookmark=' + bookmark, 'GET', function (data) {
        console.log(data);
        hasMoreItems = data.PagingInfo.HasMoreItems;
        bookmark = data.PagingInfo.Bookmark;
        enrollments = enrollments.concat(data.Items);
        if (!hasMoreItems) {
          enrollments = _.filter(enrollments, function (enrollment) {
            return enrollment.OrgUnit.Type.Code == 'Course Offering' &&
              enrollment.Access.IsActive &&
              enrollment.Access.CanAccess;
          });

          // now inject the terms
          let numEnrollments = enrollments.length;
          console.log(numEnrollments);
          _.each(enrollments, function (enrollment) {
            _this._getCourseOffering(enrollment.OrgUnit.Id, function (offeringData) {
              enrollment.Semester = offeringData.Semester.Name;
              numEnrollments--;
              if (numEnrollments === 0) {
                console.log(enrollments);
                callback(enrollments);
              }
            });
          });
        } else {
          getNextPage();
        }
      });
    }

    getNextPage();
  },
  getData: function () {
//        return _data;
    return {
      bankId: 'assessment.Bank%3A57279fc9e7dde086c7fe2102%40bazzim.MIT.EDU'  // CAD1 Spring 2017
    }
  },
  hasSession: function (callback) {
    var _this = this;
    this._getUserContext(userContext => {
        if (!userContext) {
          callback(false);
        } else {
          _this.whoAmI(function (success) {
            if (!success) {
              callback(false);
            } else {
              callback(true);
            }
          });
        }
      });
  },
  setBankId: function (payload) {
      console.log('bankId saved to user store');
      _data['bankId'] = payload.bankId;
  },
  setAuthenticationURL: function (d2lURL) {
    store.save('authenticationURL', {url: d2lURL});
  },
  whoAmI: function (callback) {
    this._fetch('/d2l/api/lp/1.5/users/whoami', 'GET', callback);
  },
  _fetch: function (path, method, callback) {
    this._getUserContext(userContext => {
      let authenticatedUrl = userContext.createAuthenticatedUrl(path, method),
        params = {};
      if (method != 'GET') {
        params.method = method;
      }
      fetch(authenticatedUrl, params)
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              callback(data);
            });
          } else {
            response.text().then(function (data) {
              console.log("response text: " + data);
              console.log(response.status);
              callback(false);
            });
          }
        })
        .catch(function (error) {
          console.log(error.message);
          callback(false);
        });
    });
  },
  _getCourseOffering: function (orgUnitId, callback) {
    let offeringUrl = '/d2l/api/lp/1.5/courses/' + orgUnitId;
    this._fetch(offeringUrl, 'GET', callback);
  },
  _getUserContext: function (callback) {
    store.get('authenticationURL')
      .then(authenticationURL => {
        let userContext = AppContext.createUserContext(credentials.d2l.host,
          credentials.d2l.port,
          authenticationURL.url
        );
        callback(userContext);
    }).catch(error => {
      callback(false);
    })
  }
});

UserStore.dispatchToken = UserDispatcher.register(function (action) {
  switch(action.type) {
    case ActionTypes.BANK_SELECTED:
      UserStore.setBankId(action.content);
      break;
  }
});

module.exports = UserStore;