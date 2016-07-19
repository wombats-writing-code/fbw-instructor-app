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
  TouchableHighlight,
  View
  } from 'react-native';

var _ = require('lodash');
var UserStore = require('../../stores/User');

var styles = require('./MissionsSidebar.styles');


class MissionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingMissions: true,
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

    if (this.state.loadingMissions) {
      return this._returnLoading();
    }

    return ( <View>
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
  _returnLoading = () => {
    return (
      <View style={styles.container}>
        <Text>Loading missions ...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

module.exports = MissionsList;
