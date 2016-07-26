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
    color: '#96CEB4',
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
  render() {
    return (
      <View>
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
      </View>
    )

  }

}

module.exports = EditMissionMetaData
