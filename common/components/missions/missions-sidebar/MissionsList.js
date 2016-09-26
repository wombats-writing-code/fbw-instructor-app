// MissionsList.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ListView,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  View
  } from 'react-native';

import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';


var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');
var UserStore = require('../../../stores/User');

var credentials = require('../../../constants/credentials');
var fbwUtils = require('fbw-utils')(credentials);
var MissionStatus = fbwUtils.CheckMissionStatus;

var AssessmentConstants = require('../../../constants/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;

var styles = require('./MissionsList.styles');


class MissionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      sortedMissions: _.sortBy(this.props.missions, ['startTime.year', 'startTime.month', 'startTime.day', 'displayName.text']), // this should be passed in already sorted by date
    }
    // re-sorting may be unnecessary
  }

  componentWillReceiveProps(nextProps) {
    // re-sorting may be unnecessary
    this.setState({ sortedMissions: _.sortBy(nextProps.missions, ['startTime.year', 'startTime.month', 'startTime.day', 'displayName.text']) });
  }

  renderRow = (rowData, sectionId, rowId, rowMap) => {
    // change icon that appears depending on now time vs. item deadline + startTime
    let missionTypeIcon = '',
      missionStatus = MissionStatus(rowData),
      row;

    let rowStyles = [styles.missionRow];

    if (this.props.selectedMission) {
      if (rowData.id == this.props.selectedMission.id) {
        rowStyles.push(styles.missionRowSelected);
      }
    }

    // chooses mission icon depending on mission type and status of mission
    if (rowData.genusTypeId == GenusTypes.IN_CLASS && missionStatus == 'over') {
      missionTypeIcon = require('../../../assets/mission-type--complete-in-class.png');

    } else if (rowData.genusTypeId == GenusTypes.IN_CLASS && (missionStatus == 'pending' || missionStatus == 'future')) {
      missionTypeIcon = require('../../../assets/mission-type--pending-in-class.png');

    } else if (rowData.genusTypeId == GenusTypes.HOMEWORK && missionStatus == 'over') {
      missionTypeIcon = require('../../../assets/mission-type--complete-out-class.png');

    } else if (rowData.genusTypeId == GenusTypes.HOMEWORK && (missionStatus == 'pending' || missionStatus == 'future')) {
      missionTypeIcon = require('../../../assets/mission-type--pending-out-class.png');

    } else {
      console.warn('mission type not recognized, icon not fetched', rowData.genusTypeId, missionStatus);
    }

    let missionRow = (
      <TouchableHighlight onPress={() => {
                            _.each(rowMap, (rowObj, hash) => {
                              if (hash !== `${sectionId}${rowId}`) {
                                try {
                                  rowMap[hash].closeRow();
                                } catch(e) {
                                  // this will fail for non-swipeable missions
                                }
                              }
                            });
                            this._viewMission(rowData)
                          }}
                          style={rowStyles}>

        <View style={styles.missionRow}>
          <Image
            style={styles.missionTypeIcon}
            source={missionTypeIcon}
          />

          <View style={styles.missionInformation}>
              <Text
                  style={styles.missionTitle}
                  numberOfLines={2}>
                {(rowData.displayName.text || '').toUpperCase()}
              </Text>
            <View>
              <Text style={styles.missionSubtitle}>
                Start {rowData.startTime.month}-{rowData.startTime.day}-{rowData.startTime.year}
              </Text>
            </View>
            <View>
              <Text style={styles.missionSubtitle}>
                Due {rowData.deadline.month}-{rowData.deadline.day}-{rowData.deadline.year}
              </Text>
            </View>
          </View>

          <Icon name="angle-right" style={styles.missionRightIcon} />
        </View>
      </TouchableHighlight>
    );

    let hiddenRow;
    if (missionStatus === 'future') {
      // TODO: might have to close other rows on swipe, too?
      row = (
        <SwipeRow	leftOpenValue={60}
  								rightOpenValue={-60}
                  disableRightSwipe={false}>
          <View style={styles.rowBack}>
            <TouchableHighlight onPress={() => {
                  this._deleteMission(rowData);
                  rowMap[`${sectionId}${rowId}`].closeRow();
                  }}
                style={[styles.deleteMission, styles.swipeButton]}>
              <Text style={styles.rowBackButtonText}>Delete</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this._editMission(rowData)}
                                style={[styles.swipeButton, styles.editMission]}>
              <Text style={styles.rowBackButtonText}>Edit</Text>
            </TouchableHighlight>
          </View>
          {missionRow}
        </SwipeRow>
      )
    } else {
      row = missionRow;
    }

    return row;
  }
  render() {

    let currentMissions;
    if (this.props.missions.length > 0) {
      currentMissions = (
        <SwipeListView
            dataSource={this.state.ds.cloneWithRows(this.state.sortedMissions)}
            renderRow={this.renderRow}
        />)

    } else {
      currentMissions = (<Text style={styles.noMissionsText}>No missions yet. Create a new one.</Text>)
    }

    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.addMissionButton} onPress={() => this._addNewMission()}>
          <Image style={styles.addNewMissionButton} source={require('../../../assets/add-icon.png')} />
        </TouchableHighlight>

        {currentMissions}
      </View>
    );
  }

  _viewMission(mission) {
    this.props.selectMission(mission, 'dashboard');
  }
  _addNewMission() {
    this.props.changeContent('addMission');
  }
  _deleteMission = (mission) => {
    this.props.selectMission(mission, 'deleteMission');
  }
  _editMission = (mission) => {
    this.props.selectMission(mission, 'editMission');
  }
  _setMission = (mission) => {
    this.props.selectMission(mission, 'missionStatus');
  }
}

module.exports = MissionsList;
