// MissionsMainContent.js

'use strict';
import React, {
    Component,
} from 'react';

import {
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

var AssessmentStore = require('../../stores/Assessment');
var UserStore = require('../../stores/User');

var Dashboard = require('./Dashboard');
var AddMission = require('./add-mission/AddMission');
var EditMission = require('./edit-mission/EditMission');
var MissionsContentNavbar = require('./MissionsContentNavbar');

var styles = StyleSheet.create({
  container: {
    paddingTop: 105,
    paddingLeft: 10.5,
    paddingRight: 10.5,
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
      title, subtitle;

    if (this.props.content == 'dashboard') {
      content = <Dashboard mission={this.props.selectedMission} />;

    } else if (this.props.content == 'addMission') {
      content = <AddMission closeAdd={this._revertToDefaultContent}
                            sidebarOpen={this.props.sidebarOpen} />;
      subtitle = '';
      title = 'Add New Mission';

    } else if (this.props.content == 'missionEdit') {
      // either show a mission config component, or a
      // mission results summary component, depending on the
      // deadline of the mission relative to now
      content = <EditMission action={this.props.content}
                             closeDetails={this._revertToDefaultContent}
                             mission={this.props.selectedMission}
                             missionItems={this.props.missionItems}
                             toggleQuestionDrawer={this.props.toggleQuestionDrawer} />;
      subtitle = this.props.selectedMission.displayName.text;
      title = 'Editing Mission';
    }

    return (
      <View style={[styles.container, this.props.style]}>
        <Animated.View style={{opacity: this.state.opacity}}>
          {/*<MissionsContentNavbar content={this.props.content}
                                 mission={this.props.selectedMission}
                                 sidebarOpen={this.props.sidebarOpen}
                                 subtitle={subtitle}
                                 title={title}
           />*/}

          {content}
        </Animated.View>
      </View>
    );
  }


  _revertToDefaultContent = () => {
    this.props.changeContent('dashboard');
  }

}

module.exports = MissionsMainContent;
