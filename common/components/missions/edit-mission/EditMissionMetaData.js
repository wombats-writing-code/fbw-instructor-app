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
require('moment-timezone');
var _ = require('lodash');

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
    fontWeight: "300",
    color: '#46B29D',
    flex: 1
  },
  muted: {
    color: '#888'
  },
  bold: {
    fontWeight: "600"
  },
})

class EditMissionMetaData extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      missionName: this.props.mission.displayName.text
    }
  }


  render() {
    let nativeStartTime = _.assign({}, this.props.mission.startTime),
      nativeDeadline = _.assign({}, this.props.mission.deadline),
      timezone = moment.tz.guess();

    nativeStartTime.month = nativeStartTime.month - 1;
    nativeDeadline.month = nativeDeadline.month - 1;
    if (nativeStartTime.month < 0) {
      nativeStartTime.month = nativeStartTime.month + 12;
    }
    if (nativeDeadline.month < 0) {
      nativeDeadline.month = nativeDeadline.month + 12;
    }
    if (moment.tz(nativeStartTime, "Europe/London").isDST()) {
      nativeStartTime.hour = nativeStartTime.hour + 1;
      // let moment.js handle numbers > 23 by also changing the day internally
    }
    if (moment.tz(nativeDeadline, "Europe/London").isDST()) {
      nativeDeadline.hour = nativeDeadline.hour + 1;
    }
    nativeStartTime = moment.tz(nativeStartTime, "Europe/London").clone().tz(timezone).format();
    nativeDeadline = moment.tz(nativeDeadline, "Europe/London").clone().tz(timezone).format();

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
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionInfoWrapper}>
              <Text style={[styles.sectionTitle]}>Dates</Text>
              <Text style={[styles.sectionSubTitle]}>
                <Text style={styles.muted}>Start </Text><Text>{moment.tz(nativeStartTime, timezone).format('ddd, h:mmA MMM D')}</Text>
                <Text style={styles.muted}>   Deadline </Text><Text >{moment.tz(nativeDeadline, timezone).format('ddd, h:mmA MMM D')}</Text>
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
