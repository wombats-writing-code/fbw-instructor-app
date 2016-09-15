// Middleware for hardcoded banks ... i.e. without an LMS and with SimpleLogin
var EventEmitter = require('events').EventEmitter;

var _ = require('lodash');
var Q = require('q');
var store = require('react-native-simple-store');

var credentials = require('../constants/credentials');
var fbwUtils = require('fbw-utils')(credentials);
var qbankFetch = fbwUtils.qbankFetch;

var HardcodedMiddleware = _.assign({}, EventEmitter.prototype, {
  clearUserContext: function () {
    store.delete('authenticationUrlD2L');
  },
  createGrade: function (assessmentName) {
  },
  enrollments: function (callback) {
    debugger;
    if (credentials.hardcodedBanks) {
      let departments = {};
      store.get('username')
        .then((username) => {
          let banksPromises = [];
          _.each(credentials.hardcodedBanks, (bankData) => {
            let bankId = bankData[0],
              department = bankData[1],
              params = {
                path: `assessment/banks/${bankId}`,
                proxy: username
              };
            departments[bankId] = department;
            banksPromises.push(qbankFetch(params));
          });
          return Q.all(banksPromises);
        })
        .then((res) => {
          return Q.all(_.map(res, (oneRes) => {return oneRes.json();}));
        })
        .then((data) => {
          let returnData = [];
          _.each(data, (datum) => {
            returnData.push({
              department: departments[datum.id],
              term: datum.description.text,
              id: datum.id,
              name: datum.displayName.text
            });
          });
          callback(returnData);
        })
        .catch((error) => {
          console.log('error getting enrollments');
          console.log(error);
        })
        .done();
    }
  },
  hasSession: function (callback) {
    store.get('username')
      .then((username) => {
        if (username !== null) {
          callback(true);
        } else {
          callback(false);
        }
      })
  },
  id: function (id) {
    return id;
  },
  setAuthenticationUrl: function (d2lURL) {
  },
  whoAmI: function (callback) {

  },
  _fetch: function (path, method, data, callback) {
    this._getUserContext(userContext => {
      let authenticatedUrl = userContext.createAuthenticatedUrl(path, method),
        params = {};
      if (method != 'GET') {
        params.method = method;
      }
      if (data !== null) {
        params.body = JSON.stringify(data);
        params.headers = {
          "accept": "application/json",
          "content-type": 'application/json'
        };
      }
      fetch(authenticatedUrl, params)
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              callback(data);
            });
          } else {
            response.text().then(function (text) {
              console.log("response text: " + text);
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
    this._fetch(offeringUrl, 'GET', null, callback);
  },
  _getOrgUnit: function (orgUnitId, callback) {
    let offeringUrl = '/d2l/api/lp/1.5/orgstructure/' + orgUnitId;
    this._fetch(offeringUrl, 'GET', null, callback);
  },
  _getUserContext: function (callback) {
    store.get('authenticationUrlD2L')
      .then(authenticationUrlD2L => {
        let userContext = AppContext.createUserContext(credentials.d2l.host,
          credentials.d2l.port,
          authenticationUrlD2L
        );
        callback(userContext);
    }).catch(error => {
      callback(false);
    })
  }
});

module.exports = HardcodedMiddleware;
