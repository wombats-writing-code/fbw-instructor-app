// MissionsSidebar.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ListView,
  Picker,
  ScrollView,
  Text,
  Image,
  TouchableHighlight,
  View
} from 'react-native';

// import SwipeableListView from 'SwipeableRow';

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');
var UserStore = require('../../stores/User');

var AssessmentConstants = require('../../constants/Assessment');
var BankConstants = require('../../constants/Bank');
var BankDispatcher = require('../../dispatchers/Bank');
var GenusTypes = AssessmentConstants.GenusTypes;

var credentials = require('../../constants/credentials');
var CourseOfferingSelector = require('../courses/CourseOfferingSelector');
var MissionsList = require('./MissionsList');
var MissionStatus = require('fbw-utils')(credentials).CheckMissionStatus;

var styles = require('./MissionsSidebar.styles');


class MissionsSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courseOfferingId: '',
      loadingMissions: props.bankId === null ? false : true,
      selectedId: '',
      showMissionsNav: props.bankId === null ? false : true,
      sortedMissions: _.sortBy(this.props.missions, 'displayName.text'), // this should be passed in already sorted by date
      subjects: []
    }
  }
  componentWillUnmount() {
  }
  componentDidMount() {
    console.log('showing sidebar');
    UserStore.enrollments(data => {
      this.setState({ subjects: data });
    });
  }
  componentWillReceiveProps(nextProps) {

<<<<<<< HEAD
  }
  render() {
    var toggleIcon = <View />,
      missionsNav = <View />;

    if (this.props.sidebarOpen) {
      toggleIcon = <Icon name="caret-left"
                         style={styles.toggleCaret} />;
    }

    if (this.state.showMissionsNav) {
      missionsNav = ( <View>
        <MissionsList changeContent={this.props.changeContent}
                      missions={this.props.missions}
                      selectMission={this.props.selectMission} />
      </View>);
    }
    return (
      <View style={styles.container}>
        <CourseOfferingSelector setCourse={this._setCourseOffering}
                                subjects={this.state.subjects} />
        {missionsNav}
=======
    } else if (rowData.genusTypeId == GenusTypes.HOMEWORK && missionStatus == 'pending') {
      missionTypeIcon = require('./assets/mission-type--pending-out-class.png');

    } else {
      console.log('warning: mission icon not found')
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
      toggleIcon = <View />,
      currentMissions = this.props.missions.length > 0 ?
                  ( <ListView
                        dataSource={ds.cloneWithRows(this.state.sortedMissions)}
                        renderRow={this.renderRow}>
                    </ListView> ) :
                  ( <View style={[styles.notification, styles.rounded]} >
                    <Text style={styles.notificationText}>
                      No existing missions.
                    </Text>
                  </View> );
    return (
      <View style={styles.container}>

        <View style={styles.sideBarNav}>
          <TouchableHighlight onPress={() => this._addNewMission()}>
            <Image source={require('./assets/add-icon.png')} />
          </TouchableHighlight>

          <TouchableHighlight onPress={() => _.noop()}>
            <Image source={require('./assets/menu-icon.png')} />
          </TouchableHighlight>
        </View>

        <View style={[styles.missionsListWrapper]}>
          <ScrollView style={styles.missionsList}>
            {currentMissions}
          </ScrollView>
        </View>
>>>>>>> master
        <View style={styles.sidebarFooter} />
      </View>
    );
  }
  _setCourseOffering = (courseOfferingId) => {
    if (courseOfferingId != "-1") {
      var subjectName, termName,
        subject = _.filter(this.state.subjects, function (subject) {
          return subject.id == courseOfferingId;
        })[0];

      this.setState({ showMissionsNav: true });
      this.setState({ courseOfferingId: courseOfferingId });
      UserStore.setDepartment(subject.department);

      // set the bank alias and update user state ...
      BankDispatcher.dispatch({
        type: BankConstants.ActionTypes.SET_BANK_ALIAS,
        content: {
          aliasId: courseOfferingId,
          departmentName: subject.department,
          subjectName: subject.name,
          termName: subject.term
        },
        callback: this._setBankId
      });
    }
  }
  _setBankId = (bankId) => {
    console.log('here in setbankid: ' + bankId);
    UserStore.setBankId(bankId);
    this.props.setBankId(bankId);
  }
}

module.exports = MissionsSidebar;
