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
  Text,TextInput, View,
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

var DirectiveList = require('./DirectiveList');
var MissionQuestions = require('./MissionQuestions');

var styles = StyleSheet.create({
  activeHeaderText: {
    color: '#2A47C9',
    textDecorationLine: 'underline'
  },
  container: {
    flex: 1
  },
  missionNameSection: {
    paddingLeft: 10.5,
    paddingTop: 21,
    paddingBottom: 21,
  },
  missionName: {
    fontSize: 21,
    fontWeight: "700",
    color: '#46B29D',
  },
  missionNameBorderContainer: {
    width: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginLeft: 10.5,
    marginBottom: 21
  },
  section: {
    paddingLeft: 10.5,
    paddingRight: 10.5,
    paddingTop: 21,
    paddingBottom: 21,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  sectionWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionInfoWrapper: {
    flex: 9
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: "300",
    marginBottom: 8,
  },
  sectionSubTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: "300",
  },
  sectionChangeIndicator: {
    fontSize: 18,
    color: '#96CEB4',
    flex: 1
  },
  muted: {
    color: '#888'
  },
  bold: {
    fontWeight: "600"
  },
  addDirectiveButton: {
    marginTop: 21,
    paddingTop: 21,
    paddingBottom: 21,
    paddingLeft: 10.5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#aaa',
    borderStyle: 'dotted'
  },
  addDirectiveButtonText: {
    fontSize: 18,
    color: '#999',
  }
});

class EditMission extends Component {
  constructor(props) {
    super(props);

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

    var missionStatus = MissionStatus(this.props.mission);

    this.state = {
      loadingItems: true,
      missionStatus: missionStatus,
      opacity: new Animated.Value(0),
      selectedPane: 'items',
      selectedDirectives: replaceMeWithRealDirectives,
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
  onLayout = (event) => {
    // TODO: how to make this height change when device is rotated?
    // This doesn't get called -- why not??? Docs say it should, on mount and on layout change...
    console.log('onLayout called');
    this.setState({ height: Dimensions.get('window').height });
  }

  render() {
    var missionContent = <View />;
    console.log(this.props.mission);

    return (
      <View style={styles.container}>

        <Animated.View style={{opacity: this.state.opacity}}>
          <TouchableHighlight style={[styles.missionNameSection]}>
            <TextInput style={[styles.sectionTitle, styles.missionName]}
                      value={this.props.mission.displayName.text}
                      onChange={_.noop}
            />
          </TouchableHighlight>
          <View style={styles.missionNameBorderContainer}></View>

          <TouchableHighlight style={[styles.section]}>
            <View style={styles.sectionWrapper}>
              <View style={styles.sectionInfoWrapper}>
                <Text style={[styles.sectionTitle]}>Dates</Text>
                <Text style={[styles.sectionSubTitle]}>
                  <Text style={styles.muted}>Start </Text><Text>{moment(this.props.mission.displayName.startTime).format('ddd, hA')}</Text>
                  <Text style={styles.muted}>   Deadline </Text><Text >{moment(this.props.mission.displayName.deadline).format('ddd, hA')}</Text>
                </Text>
              </View>
              <Text style={styles.sectionChangeIndicator}>Change</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles.section}>
            <View style={styles.sectionWrapper}>
              <View style={styles.sectionInfoWrapper}>
                <Text style={[styles.sectionTitle]}>Type</Text>
                <Text style={styles.sectionSubTitle}>{this.props.mission.genusTypeId}</Text>
              </View>
              <Text style={styles.sectionChangeIndicator}>Change</Text>
            </View>
          </TouchableHighlight>

        </Animated.View>

        <DirectiveList directives={this.state.selectedDirectives}/>
        <TouchableHighlight style={styles.addDirectiveButton}>
          <Text style={styles.addDirectiveButtonText}>Add a directive</Text>
        </TouchableHighlight>

        <Animated.View style={{opacity: this.state.contentOpacity}}>
          {/*<MissionQuestions mission={this.props.mission}
             missionItems={this.props.missionItems}
             toggleQuestionDrawer={this.props.toggleQuestionDrawer} />;*/}

        </Animated.View>
      </View>
    );
  }
  _changeContent = (newContent) => {
    this.setState({ selectedPane: newContent });
  }
}

module.exports = EditMission;
