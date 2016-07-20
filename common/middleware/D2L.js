// D2L middleware
var EventEmitter = require('events').EventEmitter;

var _ = require('lodash');
var store = require('react-native-simple-store');

var credentials = require('../constants/credentials');
var fbwUtils = require('fbw-utils')(credentials);
var D2L = require('valence');
var AppContext = new D2L.ApplicationContext(credentials.d2l.appID, credentials.d2l.appKey);


var D2LMiddleware = _.assign({}, EventEmitter.prototype, {
  clearUserContext: function () {
    store.delete('authenticationUrlD2L');
  },
  enrollments: function (callback) {
    // need to get all of these, because paginated
    var url = '/d2l/api/lp/1.9/enrollments/myenrollments/',
      bookmark = '',
      enrollments = [],
      hasMoreItems = true,
      _this = this;

    function getNextPage () {
      _this._fetch(url + '?bookmark=' + bookmark, 'GET', function (data) {
        if (data) {
          hasMoreItems = typeof data.PagingInfo.HasMoreItems !== 'undefined' ? data.PagingInfo.HasMoreItems : false;
          bookmark = typeof data.PagingInfo.Bookmark !== 'undefined' ? data.PagingInfo.Bookmark : '';
          enrollments = enrollments.concat(data.Items);
          if (!hasMoreItems) {
            enrollments = _.filter(enrollments, function (enrollment) {
              return enrollment.OrgUnit.Type.Code == 'Course Offering' &&
                enrollment.Access.IsActive &&
                enrollment.Access.CanAccess;
            });

            // now inject the terms
            let numEnrollments = enrollments.length;
            _.each(enrollments, function (enrollment) {
              _this._getCourseOffering(enrollment.OrgUnit.Id, function (offeringData) {
                enrollment.Semester = offeringData.Semester.Name.trim();
                enrollment.Department = offeringData.Department.Name.trim();
                numEnrollments--;
                if (numEnrollments === 0) {
                  var d2lCourses = [];
                  _.each(enrollments, function (subject) {
                    d2lCourses.push({
                      id: subject.OrgUnit.Id,
                      department: subject.Department,
                      displayName: `${subject.OrgUnit.Name.trim()} -- ${subject.Semester}`,
                      name: subject.OrgUnit.Name.trim(),
                      term: subject.Semester
                    });
                  });

                  callback(d2lCourses);
                }
              });
            });
          } else {
            getNextPage();
          }
        }
      });
    }

    getNextPage();
  },
  hasSession: function (callback) {
    var _this = this;
    this._getUserContext(userContext => {
        if (!userContext) {
          callback(false);
        } else {
          _this.whoAmI(function (success) {
            console.log(success)
            if (!success) {
              callback(false);
            } else {
              callback(true);
            }
          });
        }
      });
  },
  id: function (id) {
    return `assessment.Bank%3A${id}%40ACCTEST.D2L.COM`;
  },
  setAuthenticationUrl: function (d2lURL) {
    store.delete('authenticationUrlD2L');
    store.save('authenticationUrlD2L', d2lURL);
    console.log(d2lURL);
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
    this._fetch(offeringUrl, 'GET', callback);
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

module.exports = D2LMiddleware;
