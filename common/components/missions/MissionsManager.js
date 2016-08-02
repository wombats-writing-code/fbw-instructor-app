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
var SortItemsByModules = require('../../stores/sortItemsByModules');

var MissionsSidebar = require('./missions-sidebar/MissionsSidebar');
var EditDirective = require('./edit-mission/EditDirective')
var Dashboard = require('./Dashboard');
var AddMission = require('./add-mission/AddMission');
var EditMission = require('./edit-mission/EditMission');


var styles = StyleSheet.create({
  container: {

  },
  splitView: {
    flex: 1,
    flexDirection: 'row'
  },
  missionsSidebarContainer: {
    flex: 1
  },
  missionsMainContentContainer: {
    flex: 3.2,
    paddingLeft: 21,
    paddingRight: 21
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
      content: 'dashboard',
      drawerOpen: true,
      loading: true,
      missionItems: [],
      missions: [],
      modules: [],
      questionDrawerOpen: false,
      questionDrawerViewStyle: {
        height: 0
      },

      selectedMission: null,
      selectedDirective: null,

    };
    AssessmentStore.addChangeListener(this._updateMissionsFromStore);
    AssessmentItemStore.addChangeListener(this._updateMissionItemsFromStore);
    ItemStore.addChangeListener(this._handleItemsChanged);
    ModuleStore.addChangeListener(this._updateModulesFromStore);
  }

  componentWillUnmount() {
    AssessmentStore.removeChangeListener(this._updateMissionsFromStore);
    AssessmentItemStore.removeChangeListener(this._updateMissionItemsFromStore);
    ItemStore.removeChangeListener(this._handleItemsChanged);
    ModuleStore.removeChangeListener(this._updateModulesFromStore);
  }

  componentDidMount() {
    UserStore.getBankId()
    .then((bankId) => {
      if (bankId !== null) {
        this._setBankId(bankId);
      }
    });
  }

  handleSelectMission = (mission, mode) => {
    if (typeof mode === 'undefined') {
      mode = 'missionStatus'
    }
    this.setState({ selectedMission: mission });
    this.setState({ content: mode });

    AssessmentItemStore.getItems(mission.id);
  }

  handleSelectDirective = (directive) => {
    this.setState({
      selectedDirective: directive
    });
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

  _handleItemsChanged = (items) => {
    this.setState({
      allItems: allItems
    })
  }

  _updateMissionItemsFromStore = (items) => {
    this.setState({ missionItems: items });
  }

  _updateMissionsFromStore = (missions) => {
    // sort missions by startTime first
    let sorted = _.sortBy(missions,
      ['startTime.year', 'startTime.month', 'startTime.day',
       'deadline.year', 'deadline.month', 'deadline.day',
       'displayName.text']);

    this.setState({
      missions: sorted,
      loading: false
    })
  }

  _updateModulesFromStore = (modules) => {
    this.setState({
      modules: modules,
      sortedItems: SortItemsByModules(modules, this.state.allItems)
    });
  }

  render() {
    let editDirective;
    if (this.state.selectedDirective) {
      editDirective = <EditDirective directive={this.state.selectedDirective}
                                    requiredNumberByDirectiveId={{1: 2, 2: 1, 3: 2}}
                                    onSelectQuestion={this.handleSelectQuestion}
                                    onChangeRequiredNumber={this.handleChangeRequiredNumber}
                                    outcomes={this.state.outcomes}
                                    modules={this.state.modules}
                                    onClose={() => this.setState({selectedDirective: null})}
        />
    }

    let addMission;
    if (this.state.content === 'addMission') {
      addMission = <AddMission onClose={() => this.setState({content: 'dashboard'})}
                  />
    }

    // TODO: plug in the required number by directive if it's something that qbank returns,
    // if it can be computed from existing info, let's make it a selector
    let editMission;
    if (this.state.selectedMission) {
      editMission = <EditMission mission={this.state.selectedMission}
                          missionItems={this.state.missionItems}
                          onSelectDirective={this.handleSelectDirective}
                          requiredNumberByDirectiveId={{}}
      />
    }

    return (
      <View style={styles.container}>
        <View style={styles.splitView}>
          <MissionsSidebar style={styles.missionsSidebarContainer}
                           changeContent={this._changeContent}
                           loadingMissions={this.state.loading}
                           missions={this.state.missions}
                           selectMission={this.handleSelectMission}
                           setBankId={this._setBankId}
                           sidebarOpen={this.state.drawerOpen}
                           toggleSidebar={this._toggleSidebar} />


           {/*<Dashboard/>*/}

          <View style={styles.missionsMainContentContainer}>
            {addMission}
            {editMission}
          </View>
        </View>

        {/*the reason it's here instead of nested within EditMission is because i cannot for the life of me
        get it to grow beyond the size of its parent bounds when it pops up.
        if you have another way, feel free to change it.
        */}

         {editDirective}
      </View>
    )
  }

}

module.exports = MissionsManager;
