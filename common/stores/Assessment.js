// assessment store

var AssessmentDispatcher = require('../dispatchers/Assessment');
var AssessmentConstants = require('../constants/Assessment');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var store = require('react-native-simple-store');

var credentials = require('../constants/credentials');
var qbankFetch = require('fbw-utils')(credentials).qbankFetch;

var ActionTypes = AssessmentConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var D2LMiddleware = require('../middleware/D2L');

var _assessments = [];

var AssessmentStore = _.assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT, _assessments);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  createAssessment: function (data) {
    var _this = this;
    store.get('bankId')
      .then((bankId) => {
      var params = {
          data: data,
          method: 'POST',
          path: `assessment/banks/${bankId}/assessments`
        };

      qbankFetch(params, function (assessmentData) {
        var offeredParams = {
          data: data,
          method: 'POST',
          path: `assessment/banks/${bankId}/assessments/${assessmentData.id}/assessmentsoffered`
        };

        // set the Offered params for when solutions can be reviewed
        offeredParams.data['reviewOptions'] = {
          solution: {
            duringAttempt: true,
            afterAttempt: true,
            beforeDeadline: true,
            afterDeadline: true
          },
          whetherCorrect: {
            duringAttempt: true,
            afterAttempt: true,
            beforeDeadline: true,
            afterDeadline: true
          }
        };

        qbankFetch(offeredParams, function (offeredData) {
          var mashUp = assessmentData;
          mashUp.startTime = offeredData.startTime;
          mashUp.deadline = offeredData.deadline;
          mashUp.assessmentOfferedId = offeredData.id;

          _assessments.push(mashUp);

          // also create the grade object for the school
          // store.get('school')
          //   .then((school) => {
          //     if (school === 'acc') {
          //       console.log(assessmentData.displayName.text);
          //       D2LMiddleware.createGrade(assessmentData.displayName.text);
          //     }
          //   });
          _this.emitChange();
        });
      });
    });
  },
  getAssessment: function (id) {
    return _.find(_assessments, function (assessment) {
      return assessment.id == id;
    });
  },
  getAssessments: function () {
    var _this = this;
    store.get('bankId')
      .then((bankId) => {

        if (bankId !== null) {
          var numObjects = 0,
            params = {
              path: `assessment/banks/${bankId}/assessments?page=all`
            },
            finalAssessments = [];

            console.log('about to fetch with params  of', params);

          qbankFetch(params, function (data) {
            console.log('fetched assessments', data);

            if (data !== null) {
              var assessments = data.data.results;

              numObjects = numObjects + assessments.length;
              if (numObjects != 0) {
                _.each(assessments, function (assessment) {
                  var assessmentParams = {
                    path: `assessment/banks/${bankId}/assessments/${assessment.id}/assessmentsoffered?page=all`
                  };
                  qbankFetch(assessmentParams, function (offeredData) {
                    if (offeredData !== null) {
                      var mashUp = assessment;
                      offered = offeredData.data.results[0];
                      // Assume only one offered per assessment,
                      //   given how we are authoring them in this app
                      numObjects++;

                      mashUp.startTime = offered.startTime;
                      mashUp.deadline = offered.deadline;
                      mashUp.assessmentOfferedId = offered.id;

                      finalAssessments.push(mashUp);

                      numObjects--;
                      if (numObjects === 0) {
                        _assessments = finalAssessments;
                        _this.emitChange();
                      }
                    }
                  });
                  numObjects--;
                });
              } else {
                _assessments = [];
                _this.emitChange();
              }
            }
          }, (err) => {
            console.error('error', err);
          });
        }
      });
  }
});

AssessmentStore.dispatchToken = AssessmentDispatcher.register(function (action) {
    switch(action.type) {
        case ActionTypes.CREATE_ASSESSMENT:
            AssessmentStore.createAssessment(action.content);
            break;
        case ActionTypes.UPDATE_ASSESSMENT:
            AssessmentStore.updateAssessment(action.content);
            break;
        case ActionTypes.DELETE_ASSESSMENT:
            AssessmentStore.deleteAssessment(action.content);
            break;
    }
});

module.exports = AssessmentStore;
