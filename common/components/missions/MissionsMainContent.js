// MissionsMainContent.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ActivityIndicatorIOS,
  Animated,
  Dimensions,
  ListView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  } from 'react-native';

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');

var AssessmentStore = require('../../stores/Assessment');
var UserStore = require('../../stores/User');

var AddMission = require('./AddMission');
var MissionDetails = require('./MissionDetails');
var MissionsCalendar = require('./MissionsCalendar');
var MissionsContentNavbar = require('./MissionsContentNavbar');

var styles = StyleSheet.create({
  container: {
    flex: 2.5
  }
});


class MissionsMainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      width: 0
    }

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

    this.setState({ width: Dimensions.get('window').width });
  }
  render() {
    var content = <View />,
      wrapperStyle = [styles.container],
      title, subtitle;

    if (this.props.sidebarOpen) {
      wrapperStyle.push({ width: this.state.width * 0.75 });
    }

    if (this.props.content == 'calendar') {
      content = <MissionsCalendar missions={this.props.missions} />;
      // TODO: this subtitle should reflect the term of the chosen course
      subtitle = 'Spring 2016';
      title = 'Mission Control';
    } else if (this.props.content == 'addMission') {
      content = <AddMission bankId={this.props.bankId}
                            closeAdd={this._revertToDefaultContent}
                            sidebarOpen={this.props.sidebarOpen} />;
      subtitle = '';
      title = 'Add New Mission';
    } else if (this.props.content == 'missionStatus' ||
      this.props.content == 'missionEdit' ||
      this.props.content == 'missionDelete') {
      // either show a mission config component, or a
      // mission results summary component, depending on the
      // deadline of the mission relative to now
      content = <MissionDetails action={this.props.content}
                                bankId={this.props.bankId}
                                closeDetails={this._revertToDefaultContent}
                                mission={this.props.selectedMission}
                                missionItems={this.props.missionItems}
                                toggleQuestionDrawer={this.props.toggleQuestionDrawer} />;
      subtitle = this.props.selectedMission.displayName.text;
      title = 'Editing Mission';
    }

    return (
      <View style={wrapperStyle}>
        <Animated.View style={{opacity: this.state.opacity}}>
          <MissionsContentNavbar content={this.props.content}
                                 mission={this.props.selectedMission}
                                 sidebarOpen={this.props.sidebarOpen}
                                 subtitle={subtitle}
                                 title={title}
                                 toggleSidebar={this.props.toggleSidebar} />
          {content}
        </Animated.View>
      </View>
    );
  }
  _revertToDefaultContent = () => {
    this.props.changeContent('calendar');
  }
}

module.exports = MissionsMainContent;
