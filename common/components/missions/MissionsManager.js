// MissionsManager.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Text,
  ListView,
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
var GenusTypes = AssessmentConstants.GenusTypes;
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
var Dashboard = require('../dashboard/Dashboard');
var AddMission = require('./add-mission/AddMission');
var EditMission = require('./edit-mission/EditMission');
var DeleteMission = require('./delete-mission/DeleteMission');


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
  addAndSelectNewDirective = (directive) => {
    this.updateMissionDirectives(directive);
    this.handleSelectDirective(directive);
  }

  handleAddDirective = () => {
    // create a new assessment part;
    // set it as the selectedDirective;
    // bring up the EditDirective window view
    // but with no Outcome assigned yet
    var data = {
      assessmentId: this.state.selectedMission.id,
      callback: this.addAndSelectNewDirective
    };
    AssessmentDispatcher.dispatch({
        type: ActionTypes.CREATE_ASSESSMENT_PART,
        content: data
    });

  }

  handleSelectMission = (mission, mode) => {
    if (typeof mode === 'undefined') {
      mode = this.state.content;
    }
    this.setState({ content: mode });
    this._updateSelectedMissionAndItems(mission, mode);
  }

  _updateSelectedMissionAndItems = (mission, mode) => {
    this.setState({ selectedMission: mission });
    if (mode !== 'deleteMission' && typeof mission !== "undefined") {
      AssessmentItemStore.getItems(mission.id);
    }
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
      callback: this.updateMissionDirectives
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
      callback: this.updateMissionDirectiveWithItems
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
      callback: this.updateMissionDirectives
    };
    AssessmentDispatcher.dispatch({
        type: ActionTypes.UPDATE_ASSESSMENT_PART,
        content: data
    });
  }

  handleDeleteDirective = (directiveId) => {
    var data = {
      assessmentId: this.state.selectedMission.id,
      params: {
        oldSectionIds: [directiveId]
      },
      callback: this.removeDirectiveFromMission
    };
    AssessmentDispatcher.dispatch({
        type: ActionTypes.DELETE_ASSESSMENT_PART,
        content: data
    });
  }

  handleResetContent = () => {
    this.setState({ content: 'dashboard',
                    selectedMission: null });
  }

  handleSetMissionType = () => {
    let data = {
        assessmentId: this.state.selectedMission.id,
        params: {
          genusTypeId: this.state.selectedMission.genusTypeId === GenusTypes.HOMEWORK ? GenusTypes.IN_CLASS : GenusTypes.HOMEWORK
        },
        callback: this._updateMissionType
      };
    AssessmentDispatcher.dispatch({
        type: ActionTypes.UPDATE_ASSESSMENT,
        content: data
    });
  }

  _updateMissionType = (updatedMission) => {
    let mission = this.state.selectedMission,
      updatedMissions = [];

    _.each(this.state.missions, (currentMission) => {
      if (currentMission.id == updatedMission.id) {
        currentMission.genusTypeId = updatedMission.genusTypeId;
        updatedMissions.push(currentMission);
      } else {
        updatedMissions.push(currentMission);
      }
    });

    mission.genusTypeId = updatedMission.genusTypeId;

    this.setState({
      selectedMission: mission,
      missions: updatedMissions
    });
  }

  _changeContent = (newContent) => {
    this.setState({ content: newContent });
  }

  _setBankId = (bankId) => {
    UserStore.getBankId()
      .then((previousBankId) => {
        if (previousBankId !== bankId) {
          this.setState({ loading: true });
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

  removeDirectiveFromMission = (currentMission) => {
    // after you delete a directive, you need to also remove it
    // on the client -- so iterate through this.state.missionItems
    // and remove any sections that do not exist in currentMission
    let updatedMissionItems = [],
      updatedMission = this.state.selectedMission,
      updatedMissionSectionIds = _.map(currentMission.sections, 'id');
    _.each(this.state.missionItems, (section) => {
      if (updatedMissionSectionIds.indexOf(section.id) >= 0) {
        updatedMissionItems.push(section);
      }
    });

    updatedMission.sections = updatedMissionItems;
    this.setState({
      missionItems: updatedMissionItems,
      selectedMission: updatedMission
    });
  }

  updateMissionDirectives = (updatedDirective) => {
    // update the directive LO in this.state.selectedMission.sections
    // and this.state.missionItems and this.state.selectedDirective
    let updatedSections = [],
      updatedMission = this.state.selectedMission,
      isNewDirective = true;

    _.each(this.state.missionItems, (section) => {
      if (section.id !== updatedDirective.id) {
        updatedSections.push(section);
      } else {
        updatedSections.push(updatedDirective);
        isNewDirective = false;
      }
    });

    if (isNewDirective) {
      updatedSections.push(updatedDirective);
    }

    updatedMission.sections = updatedSections;
    this.setState({
      selectedMission: updatedMission,
      missionItems: updatedSections
    });

    if (this.state.selectedDirective) {
      this.setState({ selectedDirective: updatedDirective });
    }
  }

  updateMissionDirectiveWithItems = (updatedDirective, itemIds) => {
    // * Update the directive LO in this.state.selectedMission.sections
    //   and this.state.missionItems and this.state.selectedDirective
    // * Also set the items based on itemIds, pull from this.state.allItems
    //   and add them to updatedDirective.questions
    //console.log('updating with these items: ', itemIds);
    let updatedSections = [],
      updatedMission = this.state.selectedMission,
      isNewDirective = true;

    if (itemIds.length > 0) {
      updatedDirective.questions = _.filter(this.state.allItems, (item) => {
        return itemIds.indexOf(item.id) >= 0;
      });
    } else {
      updatedDirective.questions = [];
    }

    _.each(this.state.missionItems, (section) => {
      if (section.id !== updatedDirective.id) {
        updatedSections.push(section);
      } else {
        updatedSections.push(updatedDirective);
        isNewDirective = false;
      }
    });

    if (isNewDirective) {
      updatedSections.push(updatedDirective);
    }

    updatedMission.sections = updatedSections;
    this.setState({
      selectedMission: updatedMission,
      missionItems: updatedSections
    });

    if (this.state.selectedDirective) {
      this.setState({ selectedDirective: updatedDirective });
    }
  }

  render() {
    let editDirective;
    let addMission;
    let deleteMission;
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
                                  onDeleteDirective={this.handleDeleteDirective}
                                  onSetMissionType={this.handleSetMissionType}
      />)

    } else if (this.state.content === 'addMission') {
          addMission = <AddMission onClose={() => this.setState({content: 'dashboard'})} />

    } else if (this.state.content === 'dashboard' && this.state.selectedMission) {
      dashboard = <Dashboard mission={this.state.selectedMission}
                             modules={this.state.modules}
                             allItems={this.state.allItems}/>
    } else if (this.state.content === 'deleteMission' && this.state.selectedMission) {
      deleteMission = <DeleteMission mission={this.state.selectedMission}
                                     reset={this.handleResetContent} />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.splitView}>
          <MissionsSidebar style={styles.missionsSidebarContainer}
                           changeContent={this._changeContent}
                           loadingMissions={this.state.loading}
                           missions={this.state.missions}
                           selectMission={this.handleSelectMission}
                           selectedMission={this.state.selectedMission}
                           setBankId={this._setBankId}
                           sidebarOpen={this.state.drawerOpen}
                           toggleSidebar={this._toggleSidebar} />


          <View style={styles.missionsMainContentContainer}>
            {addMission}
            {editMission}
            {dashboard}
            {deleteMission}
          </View>
        </View>

         {editDirective}
      </View>
    )
  }

}

module.exports = MissionsManager;
