// DeleteMission.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  } from 'react-native';

var _ = require('lodash');

var AssessmentConstants = require('../../../constants/Assessment');

var ActionTypes = AssessmentConstants.ActionTypes;
var AssessmentStore = require('../../../stores/Assessment');
var Dispatcher = require('../../../dispatchers/Assessment');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100
  },
  muted: {
    color: '#888'
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bold: {
    fontWeight: "600"
  },
  buttonWrapper: {
    paddingTop: 21,
    paddingBottom: 21,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#aaa',
    borderStyle: 'dotted',
    margin: 20,
    width: 100,
    height: 75
  },
  cancelButton: {
    backgroundColor: '#4A7023'
  },
  deleteButton: {
    backgroundColor: '#9a0000'
  },
  actionButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionButtonText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center'
  },
});


class DeleteMission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
    };
  }
  componentWillUnmount() {
    Animated.timing(this.state.opacity, {
      toValue: 0
    }).start();
  }
  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1
    }).start();
  }

  deleteAssessment() {
    var data = {
      assessmentId: this.props.mission.id,
      assessmentOfferedId: this.props.mission.assessmentOfferedId
    };

    Dispatcher.dispatch({
        type: ActionTypes.DELETE_ASSESSMENT,
        content: data
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <View>
          <Text>
            Are you sure you want to delete this mission?
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableHighlight style={[styles.buttonWrapper, styles.cancelButton]}
                              onPress={() => this.props.reset()}>
            <View style={styles.actionButtonWrapper}>
              <Text style={styles.actionButtonText}>Cancel</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={[styles.buttonWrapper, styles.deleteButton]}
                              onPress={() => this.deleteAssessment()}>
            <View style={styles.actionButtonWrapper}>
              <Text style={styles.actionButtonText}>Delete</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }




}

module.exports = DeleteMission;
