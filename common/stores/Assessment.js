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
      currentBankId = '',
      newAssessment = {};
    store.get('bankId')
      .then((bankId) => {
        var params = {
            data: data,
            method: 'POST',
            path: `assessment/banks/${bankId}/assessments`
          };
        currentBankId = bankId;
        return qbankFetch(params);
      })
      .then((res) => {
        return res.json();
      })
      .then((assessmentData) => {
        let offeredParams = {
            data: data,
            method: 'POST',
            path: `assessment/banks/${currentBankId}/assessments/${assessmentData.id}/assessmentsoffered`
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

        return qbankFetch(offeredParams);
      })
      .then((res) => {
        return res.json();
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

        return qbankFetch(createSectionParams);
      })
      .then((res) => {
        return res.json();
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
  },
  deleteAssessment: function (data) {
    var _this = this,
      currentBankId = '',
      newAssessment = {};
    store.get('bankId')
      .then((bankId) => {
        var deleteOfferedParams = {
            method: 'DELETE',
            path: `assessment/banks/${bankId}/assessmentsoffered/${data.assessmentOfferedId}`
          };
        currentBankId = bankId;
        return qbankFetch(deleteOfferedParams);
      })
      .then((assessmentOfferedData) => {
        let deleteAssessmentParams = {
          method: 'DELETE',
          path: `assessment/banks/${currentBankId}/assessments/${data.assessmentId}`
        };

        return qbankFetch(deleteAssessmentParams);
      })
      .then((assessmentData) => {
        let updatedAssessments = _.filter(_assessments, (assessment) => {
          return assessment.id !== data.assessmentId;
        });

        _assessments = updatedAssessments;
        _this.emitChange();
      })
      .catch((error) => {
        console.log('error deleting an assessment + offered');
        console.log(error);
      })
      .done();
  },
  deleteAssessmentPart: function (data) {
    var _this = this;
    store.get('bankId')
      .then((bankId) => {
        var deleteSectionParams = {
          data: {
            sections: {}
          },
          method: 'PUT',
          path: `assessment/banks/${bankId}/assessments/${data.assessmentId}`
        };
        _.assign(deleteSectionParams.data.sections, data.params);

        return qbankFetch(deleteSectionParams);
      })
      .then((res) => {
        return res.json();
      })
      .then((updatedAssessment) => {
        data.callback(updatedAssessment);
      })
      .catch((error) => {
        console.log('error deleting section');
        console.log(error);
      })
      .done();
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
  getResults: function (data) {
    var _this = this;
    store.get('bankId')
      .then((bankId) => {
        var params = {
            path: `assessment/banks/${bankId}/assessmentsoffered/${data.assessmentOfferedId}/results?page=all`
          };
        return qbankFetch(params);
      })
      .then((res) => {
        return res.json();
      })
      .then((resultsData) => {
        data.callback(resultsData.data.results);
      })
      .catch((error) => {
        console.log('error getting assessment results');
      })
      .done();
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

        return qbankFetch(updateSectionParams);
      })
      .then((res) => {
        return res.json();
      })
      .then((updatedAssessment) => {
        // return the newly updated section
        let updatedSection = _.find(updatedAssessment.sections, {id: data.params.id});
        //_this.getAssessments();
        // when updating a section with items, need to return the itemIds
        // back, so the UI can be updated appropriately
        if (data.params.itemIds) {
          data.callback(updatedSection, data.params.itemIds);
        } else {
          data.callback(updatedSection);
        }
      })
      .catch((error) => {
        console.log('error updating section');
      })
      .done();
  },
  updateAssessment: function (data) {
    var _this = this;
    store.get('bankId')
      .then((bankId) => {
        var updateSectionParams = {
          data: {
          },
          method: 'PUT',
          path: `assessment/banks/${bankId}/assessments/${data.assessmentId}`
        };
        _.assign(updateSectionParams.data, data.params);

        return qbankFetch(updateSectionParams);
      })
      .then((res) => {
        return res.json();
      })
      .then((updatedAssessment) => {
        // return the newly updated assessment
        data.callback(updatedAssessment);
      })
      .catch((error) => {
        console.log('error updating assessment');
      })
      .done();
  },
  updateAssessmentOffered: function (data) {
    var _this = this;
    store.get('bankId')
      .then((bankId) => {
        var updateOfferedParams = {
          data: {
          },
          method: 'PUT',
          path: `assessment/banks/${bankId}/assessmentsoffered/${data.assessmentOfferedId}`
        };
        _.assign(updateOfferedParams.data, data.params);
        console.log(updateOfferedParams);
        return qbankFetch(updateOfferedParams);
      })
      .then((res) => {
        return res.json();
      })
      .then((updatedAssessmentOffered) => {
        // update the mission deadline and startTime
        // in stores, then emit a change
        let updatedMissions = [];
        console.log(updatedAssessmentOffered);
        _.each(_assessments, (assessment) => {
          if (assessment.id == updatedAssessmentOffered.assessmentId) {
            // update it before appending
            assessment.startTime = updatedAssessmentOffered.startTime;
            assessment.deadline = updatedAssessmentOffered.deadline;
            updatedMissions.push(assessment);
          } else {
            updatedMissions.push(assessment);
          }
        })

        _assessments = updatedMissions;
        _this.emitChange();
      })
      .catch((error) => {
        console.log('error updating assessment offered');
        console.log(error);
      })
      .done();
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
        case ActionTypes.UPDATE_ASSESSMENT_OFFERED:
            AssessmentStore.updateAssessmentOffered(action.content);
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
        case ActionTypes.DELETE_ASSESSMENT_PART:
            AssessmentStore.deleteAssessmentPart(action.content);
            break;
        case ActionTypes.GET_ASSESSMENT_RESULTS:
            AssessmentStore.getResults(action.content);
            break;
    }
});

module.exports = AssessmentStore;
