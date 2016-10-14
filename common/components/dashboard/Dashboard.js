// MissionsCalendar.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ActivityIndicator,
  Animated,
  Text,
  ListView, View, ScrollView,
  Slider,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

var _ = require('lodash');
var styles = require('./Dashboard.styles');

let ActionTypes = require('../../constants/Assessment').ActionTypes;
let AssessmentDispatcher = require('../../dispatchers/Assessment');
let ModuleStore = require('../../stores/Module')

import QuestionsView from './questions-view/QuestionsView';
import TreeView from './tree-view/TreeView';
import Xoces from 'xoces/components'
import Dao from 'rhumbl-dao'

// import {} from './processResults'


class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeView: 'outcomesView',
      // activeView: 'questionsView',
      loading: true,
      opacity: new Animated.Value(0),
      results: [],
      number: 1
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
    // get the results from QBank
    // every time this updates and props changes ...
    AssessmentDispatcher.dispatch({
        type: ActionTypes.GET_ASSESSMENT_RESULTS,
        content: {
          assessmentOfferedId: this.props.mission.assessmentOfferedId,
          callback: this.setResults
        }
    });
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.mission.id != prevProps.mission.id) {
      AssessmentDispatcher.dispatch({
          type: ActionTypes.GET_ASSESSMENT_RESULTS,
          content: {
            assessmentOfferedId: this.props.mission.assessmentOfferedId,
            callback: this.setResults
          }
      });
      this.setState({ loading: true });
    }
  }

  render() {
    if (this.state.loading) {
      return (
          <ActivityIndicator style={styles.loadingIndicator} size="large" />
      )
    }

    let questionsView;
    if (this.state.activeView === 'questionsView') {
      questionsView = (
        <QuestionsView takenResults={this.state.results}
               maxAttempts={this.state.number} />
      )
    }

    let treeView;
    if (this.props.modules && this.state.activeView === 'outcomesView') {
      treeView = (
          <TreeView outcomes={this._getNodes()} relationships={this._getEdges()}
                    onPressNode={this.handlePressNode} />
      )
    }

    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>

          <View style={styles.dashboardNav}>
            <TouchableHighlight style={[styles.dashboardNavButton, this.state.activeView === 'outcomesView' ? styles.selectedButton : null]}
                onPress={() => this.setState({activeView: 'outcomesView'})}>
              <Text style={styles.buttonText}>OUTCOMES</Text>
            </TouchableHighlight>

            <TouchableHighlight style={[styles.dashboardNavButton, this.state.activeView === 'questionsView' ? styles.selectedButton : null]}
                onPress={() => this.setState({activeView: 'questionsView'})}>
              <Text style={styles.buttonText}>QUESTIONS</Text>
            </TouchableHighlight>

            <TouchableHighlight style={[styles.dashboardNavButton, this.state.activeView === 'studentView' ? styles.selectedButton : null]}
                onPress={() => this.setState({activeView: 'studentView'})}>
              <Text style={styles.buttonText}>STUDENT</Text>
            </TouchableHighlight>
          </View>

          <View style={styles.sidePadding}>
            <View style={styles.pickNumberPromptWrapper}>
              <Text style={styles.pickNumberPrompt}>How <Text style={styles.studentNumber}>many</Text> students could not get it right by the</Text>
              <View style={styles.numberWrapper}>
                <Text style={styles.number}>{this.state.number}</Text>
                <Text style={styles.ordinal}>{this._getOrdinal(this.state.number)}</Text>
              </View>
              <Text style={styles.pickNumberPrompt}>try?</Text>
            </View>

            <Slider minimumValue={1} maximumValue={4} step={1}
                    minimumTrackTintColor="#E37B40" maximumTrackTintColor="#aaaaaa"
                    onSlidingComplete={(number) => this.setState({number})} />
          </View>

          <ScrollView style={[styles.scrollContainer, styles.sidePadding]}>
            {questionsView}
            {treeView}
          </ScrollView>

        </Animated.View>
      </View>
    );
  }

  setResults = (offeredResults) => {
      //offeredResults will be a list of takens, each taken
      // will have a list of questions, with each questions
      // having a list of responses.
      //  [
      //    {
      //      displayName, description, id, etc.
      //      questions: [
      //        itemId:  < use this field to match across students >
      //        text.text: < show this as a preview to faculty >
      //        responses: [ <null> or { isCorrect: state,
      //                                 submissionTime: ISO time string }]  < may have to sort by submissionTime? >
      //        learningObjectiveIds: [ < use this for outcomes view > ]
      //      ]
      //    }
      // ]

      // console.log('got results');
      // console.log(offeredResults);

      // So first, let's save the results in state, then
      // pass that along to the QuestionsView
      // Remember to pass a number value (i.e. student got it right in X tries)
      this.setState({results: offeredResults,
                     loading: false});
  }

  _getOrdinal(number) {
    if (number === 1) {
      return 'st';
    } else if (number === 2) {
      return 'nd';
    } else if (number === 3) {
      return 'rd';
    } else {
      return 'th'
    }
  }

  handlePressNode(node) {
    console.log('node was pressed', node);
  }

  // below are just dummy methods. will compute real stuff later

  _getNodes() {

    let outcomeIds = _.uniq(_.flatMap(this.state.results, (response) => _.flatMap(response.questions, 'learningObjectiveIds')));
    let outcomes = _.map(outcomeIds, ModuleStore.getOutcome);
    console.log('outcomes', outcomes, 'outcomeIds', outcomeIds);

    let params = {
      drawing: {
        background: '#eee',
        width: 600,
        height: 500,
      },
      node: {
        r: 20,
        fill: '#FFEEAD',
        stroke: '#cccccc',
        strokeWidth: 1
      }
    };

    let daoData = {entities: outcomes, relationships: relationships};
    let dag = Dao.getPathway(outcomeIds, ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], 'OUTGOING_ALL', daoData);
    console.log('dag', dag);

    let ranked = Dao.rankDAG(dag, (item) => Dao.getIncomingEntitiesAll(item.id, [''], 'OUTGOING_ALL', daoData));
    console.log('ranked', ranked);


    let relationships = [];


    let layout = Xoces.tree.layout(params, ranked, relationships);

    console.log('layout', layout);

    return layout.nodes;
  }

  _getEdges() {
    return _.map(_.range(0, 5), (idx) => {
      return {
        id: idx + '-dummy-edge',
        x1: idx*100 + 50,
        y1: _.random(30, 80),
        x2: _.random(30, 500),
        y2: _.random(80, 500),
        stroke: '#cccccc',
        strokeWidth: 1
      }
    });
  }

}

module.exports = Dashboard;
