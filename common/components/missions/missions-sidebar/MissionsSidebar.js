// MissionsSidebar.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ActivityIndicator,
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
var UserStore = require('../../../stores/User');

var AssessmentConstants = require('../../../constants/Assessment');
var BankConstants = require('../../../constants/Bank');
var BankDispatcher = require('../../../dispatchers/Bank');
var GenusTypes = AssessmentConstants.GenusTypes;

var credentials = require('../../../constants/credentials');
var CourseOfferingSelector = require('../../courses/CourseOfferingSelector');
var MissionsList = require('./MissionsList');
var MissionStatus = require('fbw-utils')(credentials).CheckMissionStatus;

var styles = require('./MissionsSidebar.styles');


class MissionsSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courseOfferingId: '',
      showMissionsNav: false,
      sortedMissions: _.sortBy(this.props.missions, 'displayName.text'), // this should be passed in already sorted by date
      subjects: []
    }
  }
  componentWillUnmount() {
  }
  componentDidMount() {
    var _this = this;
    UserStore.enrollments(data => {
      this.setState({ subjects: data }, () => {
        UserStore.getLMSCourseId()
          .then((courseId) => {
            _this._setCourseOffering(courseId);
          });
      });
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
      if (this.props.loadingMissions) {
        missionsNav = ( <View style={styles.loadingMissions}>
          <ActivityIndicator size="large" />
        </View>);
      } else {
        missionsNav = ( <View>
          <MissionsList changeContent={this.props.changeContent}
                        missions={this.props.missions}
                        selectMission={this.props.selectMission} />
        </View>);
      }
    }
    return (
      <View style={styles.container}>
        <CourseOfferingSelector courseOfferingId={this.state.courseOfferingId}
                                setCourse={this._setCourseOffering}
                                subjects={this.state.subjects} />
        {missionsNav}
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
      UserStore.setLMSCourseId(subject.id);

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
    UserStore.setBankId(bankId);
    this.props.setBankId(bankId);
  }
}

module.exports = MissionsSidebar;
