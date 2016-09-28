'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  DatePickerIOS,
  Dimensions,
  Image,
  ListView, ScrollView,
  StyleSheet,
  Switch,
  Text,TextInput, View,
  TouchableOpacity, TouchableHighlight,
  } from 'react-native';

var moment = require('moment');
require('moment-timezone');
var _ = require('lodash');

import {localDateTime} from '../../../selectors/selectors';

var AssessmentConstants = require('../../../constants/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;
var ActionTypes = AssessmentConstants.ActionTypes;

var credentials = require('../../../constants/credentials');
var DateConvert = require('fbw-utils')(credentials).ConvertDateToDictionary;
var Dispatcher = require('../../../dispatchers/Assessment');

var styles = StyleSheet.create({
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
  missionTypeIcon: {
    width: 40
  },
  section: {
    paddingLeft: 10.5,
    paddingRight: 10.5,
    paddingTop: 21,
    paddingBottom: 21,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  dateEditorWrapper: {
    flex: 9,
    flexDirection: 'column'
  },
  sectionWrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  sectionCurrentInfoWrapper: {
    flex: 1,
    flexDirection: 'column'
  },
  sectionInfoWrapper: {
    flex: 9,
    flexDirection: 'row'
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: "300",
    marginBottom: 8,
  },
  sectionSubTitle: {
    marginLeft: 25,
    paddingTop: 3
  },
  sectionChangeIndicator: {
    fontSize: 18,
    fontWeight: "300",
    color: '#46B29D',
    flex: 1
  },
  sectionChangeIndicatorWrapper: {
    flex: 1
  },
  muted: {
    color: '#888'
  },
  bold: {
    fontWeight: "600"
  },
  dateSection: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 1
  }
})

class EditMissionMetaData extends Component {
  constructor(props) {
    super(props);

    let tzOffset = (-1) * (new Date()).getTimezoneOffset() / 60;

    // using moment.js as below, need to convert the new deadline and startTime
    // to local timezone, from UTC
    let newDeadline = localDateTime(this.props.mission.deadline);
    let newStartTime = localDateTime(this.props.mission.startTime);

    this.state = {
      missionName: this.props.mission.displayName.text,
      showDateEditors: false,
      newMissionDeadline: newDeadline.toDate(),
      newMissionStartDate: newStartTime.toDate(),
      timeZoneOffsetInHours: tzOffset,
    }
  }

  saveNewDates = () => {
    // the change should trickle down from the store, so only dispatch
    // the change here.
    let data = {
      assessmentOfferedId: this.props.mission.assessmentOfferedId,
      params: {
        deadline: DateConvert(this.state.newMissionDeadline),
        startTime: DateConvert(this.state.newMissionStartDate)
      }
    };

    Dispatcher.dispatch({
        type: ActionTypes.UPDATE_ASSESSMENT_OFFERED,
        content: data
    });

    this.toggleShowChangeDates();
  }

  toggleShowChangeDates = () => {
    this.setState({ showDateEditors: !this.state.showDateEditors });
  }

  render() {
    // do this weird stuff instead of using moment.utc() because
    // that still seems to generate stuff of an hour and not account
    // for DST in GMT...
    let nativeStartTime = localDateTime(this.props.mission.startTime).format(),
      nativeDeadline = localDateTime(this.props.mission.deadline).format(),
      timezone = moment.tz.guess();

    let typeIcon = (<Image
                      source={require('../../../assets/mission-selector-icon--homework.png')}
                      style={[styles.missionTypeIcon]}
                    />);
    if (this.props.mission.genusTypeId === GenusTypes.IN_CLASS) {
      typeIcon = (<Image
                    source={require('../../../assets/mission-selector-icon--in-class.png')}
                    style={[styles.missionTypeIcon]}
                  />);
    }

    let dateEditors = <View />,
      changeDateButton = (<TouchableHighlight onPress={() => this.toggleShowChangeDates()}
                                      style={styles.sectionChangeIndicatorWrapper}>
                    <Text style={styles.sectionChangeIndicator}>Change</Text>
                  </TouchableHighlight>);

    if (this.state.showDateEditors) {
      dateEditors = (
        <View style={styles.dateEditorWrapper}>
          <View>
            <Text style={styles.inputLabel}>Start Date</Text>
            <DatePickerIOS date={this.state.newMissionStartDate}
                           minuteInterval={30}
                           mode="datetime"
                           onDateChange={(date) => this.setState({newMissionStartDate: new Date(date)})}
                           ref="startDateDatepicker"
                           timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}/>
          </View>

          <View>
            <Text style={styles.inputLabel}>Deadline</Text>
            <DatePickerIOS date={this.state.newMissionDeadline}
                           minimumDate={this.state.newMissionStartDate}
                           minuteInterval={30}
                           mode="datetime"
                           onDateChange={(date) => this.setState({newMissionDeadline: new Date(date)})}
                           ref="deadlineDatepicker"
                           timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}/>
          </View>
        </View>
      );
      changeDateButton = (
        <View>
          <TouchableHighlight onPress={() => this.toggleShowChangeDates()}
                              style={styles.sectionChangeIndicatorWrapper}>
            <Text style={styles.sectionChangeIndicator}>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.saveNewDates()}
                              style={styles.sectionChangeIndicatorWrapper}>
            <Text style={styles.sectionChangeIndicator}>Save</Text>
          </TouchableHighlight>
        </View>
      );
    }

    return (
      <View>
        {/*<TouchableHighlight></TouchableHighlight>*/}

        <TextInput maxLength={255}
                   onChangeText={(text) => this.setState({missionName: text})}
                   selectionColor="#46B29D"
                   style={styles.missionName}
                   value={this.state.missionName} />

        <View style={styles.missionNameBorderContainer}></View>

        <TouchableHighlight style={[styles.section]}>
          <View style={styles.sectionCurrentInfoWrapper}>
            <View style={[styles.sectionWrapper]}>
              <View style={styles.sectionInfoWrapper}>
                <Text style={[styles.sectionTitle]}>Dates: </Text>
                <Text style={[styles.sectionSubTitle]}>
                  <Text style={styles.muted}>Start </Text><Text>{moment.tz(nativeStartTime, timezone).format('ddd, h:mmA MMM D')}</Text>
                  <Text style={styles.muted}>   Deadline </Text><Text >{moment.tz(nativeDeadline, timezone).format('ddd, h:mmA MMM D')}</Text>
                </Text>
              </View>
              {changeDateButton}
            </View>
            {dateEditors}
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.section}>
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionInfoWrapper}>
              <Text style={[styles.sectionTitle]}>Type: </Text>
              <View style={styles.sectionSubTitle}>
                {typeIcon}
              </View>
            </View>
            <TouchableHighlight onPress={() => this.props.changeType()}
                                style={styles.sectionChangeIndicatorWrapper}>
              <Text style={styles.sectionChangeIndicator}>Change</Text>
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  onChangeName = (event) => {
    this.setState({
      missionName: event.target.value
    })
  }

}

module.exports = EditMissionMetaData
