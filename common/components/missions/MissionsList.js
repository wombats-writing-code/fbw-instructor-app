// MissionsList.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ActivityIndicator,
  ListView,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  View
  } from 'react-native';

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');
var UserStore = require('../../stores/User');

var credentials = require('../../constants/credentials');
var fbwUtils = require('fbw-utils')(credentials);
var MissionStatus = fbwUtils.CheckMissionStatus;

var AssessmentConstants = require('../../constants/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;

var styles = require('./MissionsList.styles');


class MissionsList extends Component {
  constructor(props) {
    super(props);

    console.log(this.props.missions);

    this.state = {
      sortedMissions: _.sortBy(this.props.missions, 'displayName.text'), // this should be passed in already sorted by date
    }
  }
  componentWillUnmount() {
  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    this.setState({ sortedMissions: _.sortBy(nextProps.missions, 'displayName.text') });
  }
  renderRow = (rowData, sectionId, rowId) => {
    // change icon that appears depending on now time vs. item deadline + startTime
    var missionTypeIcon = '',
      progressIcon = '',
      missionStatus = MissionStatus(rowData),
      rowStyles = [styles.missionWrapper],
      swipeButtons = [{
        text: 'Edit',
        backgroundColor: 'green',
        onPress: () => {this._editMission(rowData)}
      }, {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => {this._deleteMission(rowData)}
      }];

    if (rowData.id == this.state.selectedId) {
      rowStyles.push(styles.missionWrapperSelected);
    }

    // chooses mission icon depending on mission type and status of mission
    if (rowData.genusTypeId == GenusTypes.IN_CLASS && missionStatus == 'over') {
      missionTypeIcon = require('./assets/mission-type--complete-in-class.png');

    } else if (rowData.genusTypeId == GenusTypes.IN_CLASS && missionStatus == 'pending') {
      missionTypeIcon = require('./assets/mission-type--pending-in-class.png');

    } else if (rowData.genusTypeId == GenusTypes.HOMEWORK && missionStatus == 'over') {
      missionTypeIcon = require('./assets/mission-type--complete-out-class.png');

    } else if (rowData.genusTypeId == GenusTypes.HOMEWORK && missionStatus == 'pending') {
      missionTypeIcon = require('./assets/mission-type--pending-out-class.png');
    }

    return ( // TODO: Change this onPress call depending on what is swiped / touched
        <TouchableHighlight onPress={() => this._editMission(rowData)}
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

        </TouchableHighlight>);
  }
  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      currentMissions = this.props.missions.length > 0 ?
                  ( <ListView
                        dataSource={ds.cloneWithRows(this.state.sortedMissions)}
                        renderRow={this.renderRow}>
                    </ListView> ) :
                  ( <View style={[styles.notification, styles.rounded]} >
                    <Text style={styles.notificationText}>
                      No existing missions.
                    </Text>
                  </View> ),
      missionsNav = <View />;

    return ( <View style={styles.container}>
      <View style={styles.sideBarNav}>
        <TouchableHighlight onPress={() => this._addNewMission()}>
          <Image style={styles.addNewMissionButton} source={require('./assets/add-icon.png')} />
        </TouchableHighlight>
      </View>
      <View style={[styles.missionsListWrapper]}>
        <ScrollView style={styles.missionsList}>
          {currentMissions}
        </ScrollView>
      </View>
    </View>);
  }
  _addNewMission() {
    this.props.changeContent('addMission');
    this.setState({ selectedId: '' });
  }
  _deleteMission = (mission) => {
    this.props.selectMission(mission, 'missionDelete');
    this.setState({ selectedId: mission.id });
  }
  _editMission = (mission) => {
    this.props.selectMission(mission, 'missionEdit');
    this.setState({ selectedId: mission.id });
  }
  _setMission = (mission) => {
    this.props.selectMission(mission, 'missionStatus');
    this.setState({ selectedId: mission.id });
  }
}

module.exports = MissionsList;
