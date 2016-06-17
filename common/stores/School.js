// partner school store

var SchoolDispatcher = require('../dispatchers/School');
var AssessmentConstants = require('../constants/Assessment');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash');

var qbankFetch = require('../../utilities/fetch/fetch');

var ActionTypes = AssessmentConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _banks = [];
var _data = [];

var SchoolServiceStore = assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit(CHANGE_EVENT, _data);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    createItem: function (payload) {
        var _this = this;
        $.post(this.url(), payload).then(function (data) {
            if (payload.parentId === "") {
                if (!data.hasOwnProperty('childNodes')) {
                    data.childNodes = [];
                }
                _objectives.push(data);
                _this.emitChange();
            } else {
                _this.insertObjectiveIntoList(data, payload.parentId, function () {
                    _this.emitChange();
                });
            }
        });
        console.log(payload);
    },
    deleteItem: function (payload) {
        var _this = this;
        $.ajax({
            type: 'DELETE',
            url: this.url() + payload.id
        }).then(function () {
            _this.removeObjectiveFromList(payload.id, function () {
                _this.emitChange();
            });
        });
        console.log(payload);
    },
    getBank: function (id) {
        return _data[id];
    },
    getBanks: function () {
        var _this = this,
            params = {
                path: 'assessment/banks?page=all'
            };
        qbankFetch(params, function (data) {
            _data = data.data.results;
            _this.emitChange();
        });
    },
    getNodeChildren: function (id) {
        var _this = this,
            nodeId = typeof id === 'undefined' ? credentials.SchoolsNode : id,
            params = {
                path: 'assessment/hierarchies/nodes/' + nodeId + '/children'
            };

        qbankFetch(params, function (data) {
            _data = data.data.results;
            _this.emitChange();
        });
    },
    getSubjectTerms: function (studentId) {
        // get the subject and terms enrolled for the given studentId
        // for now, just return the ones in the bank, with term / subject
        // genus types
        var _this = this,
            nodeId = typeof id === 'undefined' ? credentials.SchoolsNode : id,
            params = {
                path: 'assessment/hierarchies/nodes/' + nodeId + '/children?descendants=5&page=all'
            };

        qbankFetch(params, function (data) {
            //
        });
    },
    insertObjectiveIntoList: function (objective, parentId, callback) {
        var numObjs = _objectives.length,
            newObjList = [];

        function iterate (testObj, callback2) {
            if (testObj.id === parentId) {
                // pass -- keep it out of the returned list.
                if (!testObj.hasOwnProperty('childNodes')) {
                    testObj.childNodes = []
                }
                testObj.childNodes.push(objective);
                callback2(testObj);
            } else if (testObj.hasOwnProperty('childNodes')) {
                if (testObj.childNodes.length > 0) {
                    var numChildren = testObj.childNodes.length,
                        newChildren = [];

                    _.each(testObj.childNodes, function (childNode) {
                        iterate(childNode, function (refreshedChild) {
                            if (refreshedChild != null) {
                                newChildren.push(refreshedChild);
                            }

                            numChildren--;
                            if (numChildren === 0) {
                                testObj.childNodes = newChildren;
                                callback2(testObj);
                            }
                        });
                    });
                } else {
                    callback2(testObj);
                }
            } else {
                callback2(testObj);
            }
        }

        _.each(_objectives, function (objective) {
            iterate(objective, function (refreshedObj) {
                newObjList.push(refreshedObj);
                numObjs--;
                if (numObjs === 0) {
                    _objectives = newObjList;
                    callback();
                }
            });
        });
    },
    removeObjectiveFromList: function (objectiveId, callback) {
        var numObjs = _objectives.length,
            newObjList = [];

        function iterate (testObj, callback2) {
            if (testObj.id === objectiveId) {
                // pass -- keep it out of the returned list.
                callback2();
            } else if (testObj.hasOwnProperty('childNodes')) {
                if (testObj.childNodes.length > 0) {
                    var numChildren = testObj.childNodes.length,
                        newChildren = [];

                    _.each(testObj.childNodes, function (childNode) {
                        iterate(childNode, function (refreshedChild) {
                            if (refreshedChild != null) {
                                newChildren.push(refreshedChild);
                            }

                            numChildren--;
                            if (numChildren === 0) {
                                testObj.childNodes = newChildren;
                                callback2(testObj);
                            }
                        });
                    });
                } else {
                    callback2(testObj);
                }
            } else {
                callback2(testObj);
            }
        }

        _.each(_objectives, function (objective) {
            iterate(objective, function (refreshedObj) {
                newObjList.push(refreshedObj);
                numObjs--;
                if (numObjs === 0) {
                    _objectives = newObjList;
                    callback();
                }
            });
        });
    },
    updateObjective: function (payload) {
        var _this = this;
        $.ajax({
            type: 'PUT',
            url: this.url() + payload.id,
            data: payload
        }).then(function (data) {
            _this.updateObjectiveInList(data, function () {
                _this.emitChange();
            });
        });
        console.log(payload);
    },
    updateObjectiveInList: function (updatedObjective, callback) {
        var numObjs = _objectives.length,
            newObjList = [];

        function iterate (testObj, callback2) {
            if (testObj.id === updatedObjective.id) {
                updatedObjective.childNodes = testObj.childNodes;
                testObj = updatedObjective;
                callback2(testObj);
            } else if (testObj.hasOwnProperty('childNodes')) {
                if (testObj.childNodes.length > 0) {
                    var numChildren = testObj.childNodes.length,
                        newChildren = [];

                    _.each(testObj.childNodes, function (childNode) {
                        iterate(childNode, function (refreshedChild) {
                            if (refreshedChild != null) {
                                newChildren.push(refreshedChild);
                            }

                            numChildren--;
                            if (numChildren === 0) {
                                testObj.childNodes = newChildren;
                                callback2(testObj);
                            }
                        });
                    });
                } else {
                    callback2(testObj);
                }
            } else {
                callback2(testObj);
            }
        }

        _.each(_objectives, function (objective) {
            iterate(objective, function (refreshedObj) {
                newObjList.push(refreshedObj);
                numObjs--;
                if (numObjs === 0) {
                    _objectives = newObjList;
                    callback();
                }
            });
        });
    }
});

module.exports = SchoolServiceStore;