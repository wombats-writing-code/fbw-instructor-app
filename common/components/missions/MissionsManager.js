// MissionsManager.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Text,
  ListView,
  ScrollView,
  View,
  ActivityIndicator,
  TouchableHighlight,
  LayoutAnimation,
  StyleSheet
} from 'react-native';

import Drawer from 'react-native-drawer';

var _ = require('lodash');

var AssessmentStore = require('../../stores/Assessment');
var AssessmentItemConstants = require('../../constants/AssessmentItem');
var AssessmentItemDispatcher = require('../../dispatchers/AssessmentItem');
var AssessmentItemStore = require('../../stores/AssessmentItem');
var BankStore = require('../../stores/Bank');
var ItemStore = require('../../stores/Item');
var ModuleStore = require('../../stores/Module');
var UserStore = require('../../stores/User');

var MissionsSidebar = require('./MissionsSidebar');
var MissionsMainContent = require('./MissionsMainContent');
var QuestionsDrawer = require('./AllQuestionsDrawer');

var SortItemsByModules = require('../../stores/sortItemsByModules');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  missionsSidebarContainer: {
    flex: 1
  },
  missionsMainContentContainer: {
    flex: 3.2
  },
  questionDrawer: {
    backgroundColor: '#7A7A7A',
    opacity: 0.5
  }
});


class MissionsManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allItems: [],
      content: 'calendar',
      drawerOpen: true,
      loading: true,
      missionItems: [],
      missions: [],
      modules: [],
      questionDrawerOpen: false,
      questionDrawerViewStyle: {
        height: 0
      },
      // questionDrawerOpen: true,     // temporary for dev only
      selectedMission: {},
      sortedItems: {}
    };
    AssessmentStore.addChangeListener(this._updateMissionsFromStore);
    AssessmentItemStore.addChangeListener(this._updateMissionItemsFromStore);
    ItemStore.addChangeListener(this._updateItemsFromStore);
    ModuleStore.addChangeListener(this._updateModulesFromStore);

    this._mainContentWidth = .75;
  }
  componentWillUnmount() {
    AssessmentStore.removeChangeListener(this._updateMissionsFromStore);
    AssessmentItemStore.removeChangeListener(this._updateMissionItemsFromStore);
    ItemStore.removeChangeListener(this._updateItemsFromStore);
    ModuleStore.removeChangeListener(this._updateModulesFromStore);
  }
  componentDidMount() {
    var _this = this;
    UserStore.getBankId()
    .then((bankId) => {
      if (bankId !== null) {
        _this._setBankId(bankId);
      }
    });
  }
  setItems(items) {
    this.setState({ allItems: items });
  }
  setMissions(missions) {
    this.setState({ missions: missions });
    this.setState({ loading: false });
  }
  setSelectedMission = (mission, mode) => {
    if (typeof mode === 'undefined') {
      mode = 'missionStatus'
    }
    this.setState({ selectedMission: mission });
    this.setState({ content: mode });

    AssessmentItemStore.getItems(mission.id);
  }
  render() {
    let questionDrawerViewStyle = [this.state.questionDrawerViewStyle];
    let questionDrawer;
    if (this.state.questionDrawerOpen) {
      questionDrawer = (<QuestionsDrawer style={questionDrawerViewStyle}
                            items={this.state.sortedItems}
                            missionItems={this.state.missionItems}
                            updateItemsInMission={this._updateItemsInMission} />)
    }

    return (
      <View style={styles.container}>
        <MissionsSidebar style={styles.missionsSidebarContainer}
                         changeContent={this._changeContent}
                         loadingMissions={this.state.loading}
                         missions={this.state.missions}
                         selectMission={this.setSelectedMission}
                         setBankId={this._setBankId}
                         sidebarOpen={this.state.drawerOpen}
                         toggleSidebar={this._toggleSidebar} />

        {questionDrawer}

        <MissionsMainContent style={styles.missionsMainContentContainer}
                             changeContent={this._changeContent}
                             content={this.state.content}
                             missionItems={this.state.missionItems}
                             missions={this.state.missions}
                             selectedMission={this.state.selectedMission}
                             sidebarOpen={this.state.drawerOpen}
                             toggleQuestionDrawer={this._toggleQuestionDrawer}
                             width={this._mainContentWidth}
           />
      </View>
    )
  }

  renderLoadingView() {
    return ( <View>
      <Text>
        Loading your missions ...
      </Text>
      <ActivityIndicator
        hidden='true'
        size='large'/>
    </View> );
  }
  _changeContent = (newContent) => {
    this.setState({ content: newContent });
  }
  _setBankId = (bankId) => {
    this.setState({ bankId: bankId });
    AssessmentStore.getAssessments();
    ItemStore.getItems();
    ModuleStore.getModules();
  }
  _toggleQuestionDrawer = () => {
    this.setState({ questionDrawerOpen: !this.state.questionDrawerOpen });

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({
      questionDrawerViewStyle: {
        height: 700
      }
    });
  }

  _updateItemsFromStore = (items) => {
    var alphabeticalItems = _.sortBy(items,
      ['displayName.text']),
      moduleItems = {};

    this.setItems(alphabeticalItems);

    if (this.state.modules.length === 0) {
      moduleItems.none = {
          displayName: 'No module',
          items: alphabeticalItems
        };

      this.setState({ sortedItems: moduleItems });
    } else {
      this.setState({ sortedItems: SortItemsByModules(this.state.modules, alphabeticalItems) });
    }
  }
  _updateItemsInMission = (items) => {
    AssessmentItemDispatcher.dispatch({
        type: AssessmentItemConstants.ActionTypes.SET_ITEMS,
        content: {
          assessmentId: this.state.selectedMission.id,
          items: items
        }
    });
  }
  _updateMissionItemsFromStore = (items) => {
    this.setState({ missionItems: items });
  }
  _updateMissionsFromStore = (missions) => {
    // sort missions by startTime first
    this.setMissions(_.sortBy(missions,
      ['startTime.year', 'startTime.month', 'startTime.day',
       'deadline.year', 'deadline.month', 'deadline.day',
       'displayName.text']));
  }
  _updateModulesFromStore = (modules) => {

    this.setState({ modules: modules }, function () {
      if (this.state.allItems.length === 0) {
        this.setState({ sortedItems: SortItemsByModules(this.state.modules, []) });
      } else {
        this.setState({ sortedItems: SortItemsByModules(this.state.modules, this.state.allItems) });
      }
    });
  }
}

module.exports = MissionsManager;
