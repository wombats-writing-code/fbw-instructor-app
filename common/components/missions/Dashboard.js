// MissionsCalendar.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ActivityIndicator,
  Animated,
  Text,
  ListView,
  ScrollView,
  View,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

var _ = require('lodash');

var styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 3
  },
  dashboardNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 18
  },
  dashboardNavButton: {
    padding: 9,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  selectedButton: {
    borderColor: '#888'
  },
  buttonText: {
    color: '#666',
    fontWeight: "500",
    letterSpacing: 1
  }
});

import TreeView from './tree-view/TreeView';
import QuestionsView from './questions-view/QuestionsView';
let ActionTypes = require('../../constants/Assessment').ActionTypes;
let AssessmentDispatcher = require('../../dispatchers/Assessment');

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeView: 'outcomesView',
      loading: true,
      opacity: new Animated.Value(0),
      results: []
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
    AssessmentDispatcher.dispatch({
        type: ActionTypes.GET_ASSESSMENT_RESULTS,
        content: {
          assessmentOfferedId: this.props.mission.assessmentOfferedId,
          callback: this.setResults
        }
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    let questionsView;
    if (this.state.activeView === 'questionsView') {
      questionsView = (
        <ScrollView>
          <QuestionsView results={this.state.results} />
        </ScrollView>
      )
    }

    let treeView;
    if (this.state.activeView === 'outcomesView') {
      treeView = (
        <ScrollView>
          <TreeView nodes={this._getNodes()} edges={this._getEdges()}
                    onPressNode={this.handlePressNode} />
        </ScrollView>
      )
    }

    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>
        <View style={styles.dashboardNav}>
          <TouchableHighlight style={[styles.dashboardNavButton, this.state.activeView === 'questionsView' ? styles.selectedButton : null]}
              onPress={() => this.setState({activeView: 'questionsView'})}>
            <Text style={styles.buttonText}>QUESTIONS</Text>
          </TouchableHighlight>

          <TouchableHighlight style={[styles.dashboardNavButton, this.state.activeView === 'outcomesView' ? styles.selectedButton : null]}
              onPress={() => this.setState({activeView: 'outcomesView'})}>
            <Text style={styles.buttonText}>OUTCOMES</Text>
          </TouchableHighlight>
        </View>

          {questionsView}
          {treeView}

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

      console.log('got results');
      console.log(offeredResults);

      // So first, let's save the results in state, then
      // pass that along to the QuestionsView
      // Remember to pass a selector value (i.e. student got it right in X tries)
      this.setState({results: offeredResults,
                     loading: false});
  }

  handlePressNode(node) {
    console.log('node was pressed', node);
  }

  // below are just dummy methods. will compute real stuff later

  _getNodes() {
    return _.map(_.range(0, 5), (idx) => {
      return {
        id: idx + '-dummy-node',
        x: idx*100 + 50,
        y: _.random(30, 80),
        r: 20,
        fill: '#FFEEAD',
        stroke: '#cccccc',
        strokeWidth: 1
      }
    });
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
