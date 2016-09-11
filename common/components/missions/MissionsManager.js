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
var AssessmentConstants = require('../../constants/Assessment');
var ActionTypes = AssessmentConstants.ActionTypes;
var AssessmentDispatcher = require('../../dispatchers/Assessment');
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
        AssessmentStore.getAssessments();
        ItemStore.getItems();
        ModuleStore.getModules();
      }
    });
  }

  handleAddDirective = () => {
    // create a new assessment part;
    // set it as the selectedDirective;
    // bring up the EditDirective window view
    // but with no Outcome assigned yet
    var data = {
      assessmentId: this.state.selectedMission.id,
      callback: this.handleSelectDirective
    };
    AssessmentDispatcher.dispatch({
        type: ActionTypes.CREATE_ASSESSMENT_PART,
        content: data
    });

  }

  handleSelectMission = (mission, mode) => {
    if (typeof mode === 'undefined') {
      mode = 'missionStatus'
    }
    this.setState({ content: mode });
    this._updateSelectedMissionAndItems(mission);
  }

  _updateSelectedMissionAndItems = (mission) => {
    this.setState({ selectedMission: mission });
    AssessmentItemStore.getItems(mission.id);
  }

  handleSelectDirective = (directive) => {
    console.log('setting directive');
    this.setState({
      selectedDirective: directive
    });
  }

  handleSetDirectiveLO = (outcome) => {
    var data = {
      assessmentId: this.state.selectedMission.id,
      params: {
        id: this.state.selectedDirective.id,
        itemIds: [],  // reset these when you change the directive LO
        learningObjectiveId: outcome.id,
        minimumProficiency: '0'
      },
      callback: this.handleSelectDirective
    };
    AssessmentDispatcher.dispatch({
        type: ActionTypes.UPDATE_ASSESSMENT_PART,
        content: data
    });
  }

  handleSetDirectiveItems = (itemIds) => {
    var data = {
      assessmentId: this.state.selectedMission.id,
      params: {
        id: this.state.selectedDirective.id,
        itemIds: itemIds
      },
      callback: this.handleSelectDirective
    };
    AssessmentDispatcher.dispatch({
        type: ActionTypes.UPDATE_ASSESSMENT_PART,
        content: data
    });
  }

  handleChangeRequiredNumber = (minimumRequired) => {
    var data = {
      assessmentId: this.state.selectedMission.id,
      params: {
        id: this.state.selectedDirective.id,
        minimumProficiency: minimumRequired.toString()  // qbank expects a string here, not an int
      },
      callback: this.handleSelectDirective
    };
    AssessmentDispatcher.dispatch({
        type: ActionTypes.UPDATE_ASSESSMENT_PART,
        content: data
    });
  }

  handleDeleteDirective = (directiveId) => {

  }

  _changeContent = (newContent) => {
    this.setState({ content: newContent });
  }

  _setBankId = (bankId) => {
    UserStore.getBankId()
      .then((previousBankId) => {
        if (previousBankId !== bankId) {
          UserStore.setBankId(bankId);
          AssessmentStore.getAssessments();
          ItemStore.getItems();
          ModuleStore.getModules();
        }
      });
  }

  _handleItemsChanged = (items) => {
    this.setState({
      allItems: items
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
    });

    if (this.state.selectedMission !== null) {
      // update the info on this one, too, but without
      // updating the rendered view
      let selectedMission = _.find(missions, {id: this.state.selectedMission.id });
      this.handleSelectMission(selectedMission);
    }
  }

  _updateModulesFromStore = (modules) => {
    this.setState({
      modules: modules,
      sortedItems: SortItemsByModules(modules, this.state.allItems)
    });
  }

  render() {
    let editDirective;
    let addMission;
    let editMission;
    let dashboard;

    if (this.state.content === 'editMission' && this.state.selectedDirective) {
      editDirective = <EditDirective allItems={this.state.allItems}
                                     directive={this.state.selectedDirective}
                                     onSetDirectiveOutcome={this.handleSetDirectiveLO}
                                     onUpdateQuestions={this.handleSetDirectiveItems}
                                     onChangeRequiredNumber={this.handleChangeRequiredNumber}
                                     mission={this.state.selectedMission}
                                     missionItems={this.state.missionItems}
                                     modules={this.state.modules}
                                     onClose={() => this.setState({selectedDirective: null})}
        />

    } else if (this.state.content === 'editMission') {
      editMission = (<EditMission mission={this.state.selectedMission}
                                 missionItems={this.state.missionItems}
                                 onAddDirective={this.handleAddDirective}
                                 onSelectDirective={this.handleSelectDirective}
      />)

    } else if (this.state.content === 'addMission') {
          addMission = <AddMission onClose={() => this.setState({content: 'dashboard'})} />

    } else if (this.state.content === 'dashboard') {
      dashboard = <Dashboard mission={this.state.selectedMission}/>
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


          <View style={styles.missionsMainContentContainer}>
            {addMission}
            {editMission}
            {dashboard}
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
