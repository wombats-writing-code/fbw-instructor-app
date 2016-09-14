// Questions View for mission results
// Should take a list of responses
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
// and organize them by question itemId, keeping count of how many
// students got them right in X attempts
//
// Two input parameters:
//   1) results
//   2) selector value


'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  View,
  TouchableHighlight,
  ListView,
  StyleSheet,
  Text,
  WebView
} from 'react-native';

let _ = require('lodash');

var credentials = require('../../../constants/credentials');
var MathJaxURL = credentials.MathJaxURL;
var MathWebView = require('../../math-webview/MathWebView');

let styles = StyleSheet.create({
  notification: {
    backgroundColor: '#ff9c9c',
    padding: 3
  },
  notificationText: {
    fontSize: 10,
    padding: 5
  },
  progressIcon: {
    marginRight: 3
  },
  rounded: {
    borderRadius: 3
  },
  questionRow: {
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    padding: 5
  },
  questionTextWrapper: {
    flex: 5
  },
  attemptsTextWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
});

class QuestionsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
  }

  renderRow = (rowData) => {
    let selectorValue = this.props.attemptsSelector ? this.props.attemptsSelector : 1;
    return (
      <View style={styles.questionRow}>
        <View style={styles.questionTextWrapper}>
          <MathWebView content={rowData.text} />
        </View>
        <View style={styles.attemptsTextWrapper}>
          <Text>
            {rowData.numberStudentsByAttempt[selectorValue]}
          </Text>
        </View>
      </View>
    )
  }

  render() {
    let sortedQuestions = {},
      questions;
    // let's organize all the questions in all takens by itemId
    _.each(this.props.results, (taken) => {
      let studentAttemptsBeforeCorrect = {};
      _.each(taken.questions, (question) => {
        if (_.keys(sortedQuestions).indexOf(question.itemId) < 0) {
          // TODO: it would be nice not to hardcode the possible # of attempts
          // this correlates to possible input values from the slider
          sortedQuestions[question.itemId] = {
            text: question.text.text,
            numberStudentsByAttempt: {
              0: 0,
              1: 0,
              2: 0,
              3: 0,
              4: 0
            }
          };
          studentAttemptsBeforeCorrect[question.itemId] = 0;
        }
        // because a specific item / LO might be duplicated within a route,
        // we'll increment until they got that item right
        if (question.response) {
          if (!question.responses[0].isCorrect) {
            studentAttemptsBeforeCorrect[question.itemId]++;
          }
        }
      });

      // now for each item, we add back in this student's
      // attempts
      _.each(_.keys(studentAttemptsBeforeCorrect), (itemId) => {
        let numberAttempts = studentAttemptsBeforeCorrect[itemId];
        if (numberAttempts > 0) {
          sortedQuestions[itemId].numberStudentsByAttempt[numberAttempts]++;
        }
      });
    });

    // now map sortedQuestions into an array for ListView
    sortedQuestions = _.map(sortedQuestions, (question, itemId) => {
      return {
        itemId: itemId,
        text: question.text,
        numberStudentsByAttempt: question.numberStudentsByAttempt
      };
    });

    questions = sortedQuestions.length > 0 ?
              ( <ListView
                    dataSource={this.state.ds.cloneWithRows(sortedQuestions)}
                    renderRow={this.renderRow}>
                </ListView> ) :
              ( <View style={[styles.notification, styles.rounded]} >
                <Text style={styles.notificationText}>
                  No questions in this mission.
                </Text>
              </View> );

    return (
      <View>
        {questions}
      </View>
    );
  }

  _wrapHTMLWithMathjax = (markup) => {
    return `<!DOCTYPE html>
      <html>
        <head>
          <script src="${MathJaxURL}"></script>
        </head>
        <body>
          ${markup}
        </body>
      </html>`;
  }
}

module.exports = QuestionsView
