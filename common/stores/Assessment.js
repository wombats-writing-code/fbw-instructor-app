// assessment store

var AssessmentDispatcher = require('../dispatchers/Assessment');
var AssessmentConstants = require('../constants/Assessment');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var Q = require('q');
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
    var _this = this,
      newAssessment = {};
    store.get('bankId')
      .then((bankId) => {
        var params = {
            data: data,
            method: 'POST',
            path: `assessment/banks/${bankId}/assessments`
          };

        Q(qbankFetch(params))
          .then((res) => {
            return Q(res.json());
          })
          .then((assessmentData) => {
            let offeredParams = {
                data: data,
                method: 'POST',
                path: `assessment/banks/${bankId}/assessments/${assessmentData.id}/assessmentsoffered`
              };

            newAssessment = assessmentData;

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

            return Q(qbankFetch(offeredParams));
          })
          .then((res) => {
            return Q(res.json());
          })
          .then((offeredData) => {
            var mashUp = newAssessment;
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
          })
          .catch((error) => {
            console.log('error creating an assessment + offered');
          })
          .done();
      });
  },
  createAssessmentPart: function (data) {
    var _this = this;
    store.get('bankId')
      .then((bankId) => {
      var createSectionParams = {
        data: {
          sections: {
            newSections: [{
              scaffold: true,
              quota: 1
            }]
          }
        },
        method: 'PUT',
        path: `assessment/banks/${bankId}/assessments/${data.assessmentId}`
      };

      Q(qbankFetch(createSectionParams))
        .then((res) => {
          return Q(res.json());
        })
        .then((updatedAssessment) => {
          // have to return the ID / section of the newly created section here ...
          // it should be the last section (appended)
          data.callback(_.last(updatedAssessment.sections));
        })
        .catch((error) => {
          console.log('error creating a new section');
        })
        .done();
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
          var params = {
              path: `assessment/banks/${bankId}/assessments?sections&page=all`
            },
            finalAssessments = [];
          Q(qbankFetch(params))
            .then((res) => {
              return Q(res.json());
            })
            .then((data) => {
              if (data !== null) {
                var assessments = data.data.results;

                if (assessments.length !== 0) {
                  let offeredPromises = [];
                  _assessments = assessments;
                  _.each(assessments, function (assessment) {
                    offeredPromises.push(qbankFetch({
                      path: `assessment/banks/${bankId}/assessments/${assessment.id}/assessmentsoffered?page=all`
                    }));
                  });
                  return Q.all(offeredPromises);
                } else {
                  _assessments = [];
                  return Q.reject('done');
                }
              }
            })
            .then((res) => {
              let offeredJson = [];
              _.each(res, (offered) => {
                offeredJson.push(offered.json());
              });
              return Q.all(offeredJson);
            })
            .then((data) => {
              _.each(_assessments, (_assessment, index) => {
                _assessment.startTime = data[index].data.results[0].startTime;
                _assessment.deadline = data[index].data.results[0].deadline;
                _assessment.assessmentOfferedId = data[index].data.results[0].id;
              });
              _this.emitChange();
            })
            .then(null, (err) => {
              if (err == 'done') {
                _this.emitChange();
              }
            })
            .catch((error) => {
              console.log('error getting assessments + offered data');
            })
            .done();
        }
      });
  },
  updateAssessmentPart: function (data) {
    var _this = this;
    store.get('bankId')
      .then((bankId) => {
      var updateSectionParams = {
        data: {
          sections: {
            updatedSections: [{
              scaffold: true,
              quota: 1
            }]
          }
        },
        method: 'PUT',
        path: `assessment/banks/${bankId}/assessments/${data.assessmentId}`
      };
      _.assign(updateSectionParams.data.sections.updatedSections[0], data.params);

      Q(qbankFetch(updateSectionParams))
        .then((res) => {
          return Q(res.json());
        })
        .then((updatedAssessment) => {
          // return the newly updated section
          let updatedSection = _.find(updatedAssessment.sections, {id: data.params.id});
          _this.getAssessments();
          data.callback(updatedSection);
        })
        .catch((error) => {
          console.log('error updating section');
        })
        .done();
    });
  },
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
        case ActionTypes.CREATE_ASSESSMENT_PART:
            AssessmentStore.createAssessmentPart(action.content);
            break;
        case ActionTypes.UPDATE_ASSESSMENT_PART:
            AssessmentStore.updateAssessmentPart(action.content);
            break;
    }
});

module.exports = AssessmentStore;
