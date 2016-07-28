// MissionDetails.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  DatePickerIOS,
  Dimensions,
  ListView, ScrollView,
  StyleSheet,
  Switch,
  Text,TextInput, Image, View,
  TouchableOpacity, TouchableHighlight,
  } from 'react-native';

var moment = require('moment');
var _ = require('lodash');

var AssessmentConstants = require('../../../constants/Assessment');

var ActionTypes = AssessmentConstants.ActionTypes;
var AssessmentStore = require('../../../stores/Assessment');
var Dispatcher = require('../../../dispatchers/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;

var credentials = require('../../../constants/credentials');
var fbwUtils = require('fbw-utils')(credentials);
var DateConvert = fbwUtils.ConvertDateToDictionary;
var MissionStatus = fbwUtils.CheckMissionStatus;

var EditMissionMetaData = require('./EditMissionMetaData');
var DirectiveList = require('./DirectiveList');
var MissionQuestions = require('./MissionQuestions');

var styles = StyleSheet.create({
  container: {
  },
  muted: {
    color: '#888'
  },
  bold: {
    fontWeight: "600"
  },
  addDirectiveButton: {
    paddingTop: 21,
    paddingBottom: 21,
    paddingLeft: 10.5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#aaa',
    borderStyle: 'dotted'
  },
  addDirectiveButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addDirectiveButtonText: {
    fontSize: 18,
    color: '#999',
    marginLeft: 5,
  },
  directives: {
    marginTop: 42
  }
});

// a mock to sub in for this.props.mission.directives
let replaceMeWithRealDirectives = [
  {
    id: '1',
    displayName: 'Solve absolute value inequality'
  },
  {
    id: '2',
    displayName: 'Find roots of polynomials'
  }
];

// a mock for this.props.mission.[however Cole is going to do it or whatever]
// probably need to build out a selector for this
let kByDirectiveId = _.reduce(replaceMeWithRealDirectives, (result, item) => {
  result[item.id] = 0;
  return result;
}, {});

let itemsByDirectiveId = _.reduce(replaceMeWithRealDirectives, (result, item) => {
  result[item.id] = {id: '1', question: {text: 'blah'}};
  return result;
}, {});

class EditMission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingItems: true,
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

  createAssessment() {
    var data = {
      deadline: DateConvert(this.state.missionDeadline),
      description: 'A Fly-by-Wire mission',
      displayName: this.state.missionDisplayName,
      startTime: DateConvert(this.state.missionStartDate)
    };

    if (this.state.inClass) {
      data.genusTypeId = GenusTypes.IN_CLASS;
    } else {
      data.genusTypeId = GenusTypes.HOMEWORK;
    }

    Dispatcher.dispatch({
        type: ActionTypes.CREATE_ASSESSMENT,
        content: data
    });

    this.props.closeAdd();
  }

  render() {
    console.log('EditMission render():', this.props.mission, 'mission items', this.props.missionItems);

    return (
      <View style={styles.container}>

        <EditMissionMetaData mission={this.props.mission}/>

        <DirectiveList style={styles.directives}
                      directives={this.props.mission.directives || replaceMeWithRealDirectives}
                      requiredNumberByDirectiveId={this.props.requiredNumberByDirectiveId}
                      itemsByDirectiveId={this.props.itemsByDirectiveId}
                      onSelectDirective={this.props.onSelectDirective}
        />

        <TouchableHighlight style={styles.addDirectiveButton}>
          <View style={styles.addDirectiveButtonWrapper}>
            <Image source={require('../../../assets/add--dark.png')}/>
            <Text style={styles.addDirectiveButtonText}>Add a directive</Text>
          </View>
        </TouchableHighlight>

      </View>
    );
  }




}

module.exports = EditMission;