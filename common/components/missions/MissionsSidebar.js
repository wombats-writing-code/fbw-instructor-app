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

import SwipeableListView from 'SwipeableRow';

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');
var UserStore = require('../../stores/User');

var AssessmentConstants = require('../../constants/Assessment');
var BankConstants = require('../../constants/Bank');
var BankDispatcher = require('../../dispatchers/Bank');
var GenusTypes = AssessmentConstants.GenusTypes;

var credentials = require('../../constants/credentials');
var fbwUtils = require('fbw-utils')(credentials);

var MissionsList = require('./MissionsList');
var MissionStatus = fbwUtils.CheckMissionStatus;

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
        <MissionsList />
      </View>);
    }
    return (
      <View style={styles.container}>
        <View style={styles.sideBarNav}>
          <TouchableHighlight onPress={() => this.props.toggleSidebar()}>
            {toggleIcon}
          </TouchableHighlight>
        </View>
        <View style={styles.subjectWrapper}>
          <Picker selectedValue={this.state.courseOfferingId}
                  onValueChange={(courseOfferingId) => this._setCourseOffering(courseOfferingId)}>
            <Picker.Item label="Select your D2L course" value="-1"/>
            {this._pickerItems()}
          </Picker>
        </View>
        {missionsNav}
        <View style={styles.sidebarFooter} />
      </View>
    );
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
  _pickerItems = () => {
    return _.map(this.state.subjects, function (subject) {
      return <Picker.Item key={subject.id}
                          label={subject.displayName}
                          value={subject.id} />
    });
  }
  _setCourseOffering = (courseOfferingId) => {
    if (courseOfferingId != "-1") {
      var subjectName, termName,
        subject = _.filter(this.state.subjects, function (subject) {
          return subject.id == courseOfferingId;
        })[0];

      this.setState({ courseOfferingId: courseOfferingId });

      // set the bank alias and update user state ...
      BankDispatcher.dispatch({
        type: BankConstants.ActionTypes.SET_BANK_ALIAS,
        content: {
          aliasId: courseOfferingId,
          departmentName: subject.department.trim(),
          subjectName: subject.name.trim(),
          termName: subject.term.trim()
        },
        callback: this._setBankId
      });
    }
  }
  _setBankId = (bankId) => {
    this.setState({ loadingMissions: true });
    this.setState({ showMissionsNav: true });
    this.props.setBankId(bankId);
  }
  _setMission = (mission) => {
    this.props.selectMission(mission, 'missionStatus');
    this.setState({ selectedId: mission.id });
  }
}

module.exports = MissionsSidebar;
