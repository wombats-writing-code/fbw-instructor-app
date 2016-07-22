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
  ActivityIndicatorIOS,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

import Drawer from 'react-native-drawer';

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');

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

var SortItemsByModules = require('../../../utilities/handcar/sortItemsByModules');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: 600,
    flexDirection: 'row'
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
      bankId: null,
      content: 'calendar',
      drawerOpen: true,
      loading: true,
      missionItems: [],
      missions: [],
      modules: [],
      questionDrawerOpen: false,
      selectedMission: {},
      sortedItems: {}
    };
    AssessmentStore.addChangeListener(this._updateMissionsFromStore);
    AssessmentItemStore.addChangeListener(this._updateMissionItemsFromStore);
    ItemStore.addChangeListener(this._updateItemsFromStore);
    ModuleStore.addChangeListener(this._updateModulesFromStore);
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
    console.log('setting missions');
    this.setState({ missions: missions });
    this.setState({ loading: false });
  }
  setSelectedMission = (mission, mode) => {
    if (typeof mode === 'undefined') {
      mode = 'missionStatus'
    }
    this.setState({ selectedMission: mission });
    this.setState({ content: mode });

    if (this.state.bankId != null) {
      AssessmentItemStore.getItems(this.state.bankId, mission.id);
    }
  }
  render() {
    // if (this.state.loading) {
    //   return this.renderLoadingView();
    // }

    return (
      <Drawer acceptPan={true}
              captureGestures={'open'}
              content={<MissionsSidebar bankId={this.state.bankId}
                                        changeContent={this._changeContent}
                                        missions={this.state.missions}
                                        selectMission={this.setSelectedMission}
                                        setBankId={this._setBankId}
                                        sidebarOpen={this.state.drawerOpen}
                                        toggleSidebar={this._toggleSidebar} />}
              open={this.state.drawerOpen}
              openDrawerOffset={0.7}
              side='left'
              style={styles.container}
              tweenHandler={Drawer.tweenPresets.parallax}>

      <Drawer acceptPan={false}
              captureGestures={false}
              content={<QuestionsDrawer items={this.state.sortedItems}
                                        missionItems={this.state.missionItems}
                                        updateItemsInMission={this._updateItemsInMission} />}
              open={this.state.questionDrawerOpen}
              openDrawerOffset={0.5}
              panThreshold={1.5}
              side='right'
              type='overlay'>
          <View>
            <MissionsMainContent bankId={this.state.bankId}
                                 changeContent={this._changeContent}
                                 content={this.state.content}
                                 missionItems={this.state.missionItems}
                                 missions={this.state.missions}
                                 selectedMission={this.state.selectedMission}
                                 sidebarOpen={this.state.drawerOpen}
                                 toggleQuestionDrawer={this._toggleQuestionDrawer}
                                 toggleSidebar={this._toggleSidebar} />
          </View>
        </Drawer>
      </Drawer>
    )
  }

  renderLoadingView() {
    return ( <View>
      <Text>
        Loading your missions ...
      </Text>
      <ActivityIndicatorIOS
        hidden='true'
        size='large'/>
    </View> );
  }
  _changeContent = (newContent) => {
    this.setState({ content: newContent });
  }
  _setBankId = (bankId) => {
    console.log('here in missions manager: ' + bankId);
    this.setState({ bankId: bankId });
    AssessmentStore.getAssessments();
    ItemStore.getItems();
    ModuleStore.getModules();
  }
  _toggleQuestionDrawer = () => {
    this.setState({ questionDrawerOpen: !this.state.questionDrawerOpen });
    if (this.state.drawerOpen) {
      this._toggleSidebar();
    }
  }
  _toggleSidebar = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
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
