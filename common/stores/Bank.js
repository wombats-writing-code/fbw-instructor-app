// bank store
var AssessmentConstants = require('../constants/Assessment');
var BankDispatcher = require('../dispatchers/Bank');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var qbankFetch = require('../../utilities/fetch/fetch');

var ActionTypes = AssessmentConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;
var GenusTypes = AssessmentConstants.GenusTypes;

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
    getBanks: function () {
        var _this = this,
            params = {
                path: 'assessment/banks?genus_type_id=' + GenusTypes.SUBJECT + '&page=all'
            },
            numberTotalFetches = 0;
        qbankFetch(params, function (data) {
            var subjects = data.data.results;

            numberTotalFetches = numberTotalFetches + subjects.length;
            _.each(subjects, function (subject) {
                var subjectParams = {
                    path: 'assessment/hierarchies/nodes/' + subject.id + '/children?descendants=1&page=all'
                };

                qbankFetch(subjectParams, function (subjectData) {
                    // match subject + terms here
                    var terms = subjectData.data.results;

                    numberTotalFetches = numberTotalFetches + terms.length;

                    _.each(terms, function (term) {
                        var displayName = subject.displayName.text + ', ' + term.displayName.text;

                        _banks.push({
                            id: term.id,
                            displayName: displayName
                        });

                        numberTotalFetches --;

                        if (numberTotalFetches === 0) {
                            _this.emitChange();
                        }
                    });
                });

                numberTotalFetches --;
            });
        });
    }
});


module.exports = BankStore;