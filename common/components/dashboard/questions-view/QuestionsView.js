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
var moment = require('moment');

var credentials = require('../../../constants/credentials');
var MathJaxURL = credentials.MathJaxURL;
var MathWebView = require('../../math-webview/MathWebView');

import {uniqueQuestions, notCorrectWithinAttempts} from '../processResults'

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

  renderRow = (question) => {

    let numStudentsWrong = notCorrectWithinAttempts(question.itemId, this.props.attemptsSelector);

    return (
      <View style={styles.questionRow}>
        <View style={styles.questionTextWrapper}>
          <MathWebView content={question.text.text} />
        </View>
        <View style={styles.attemptsTextWrapper}>
          <Text style={styles.attemptNumber}>
            {numStudentsWrong}
          </Text>
        </View>
      </View>
    )
  }

  render() {

    let questionsList = uniqueQuestions(this.props.results);
    console.log('questionsList', questionsList)

    return (
      <ListView dataSource={this.state.ds.cloneWithRows(questionsList)}
                renderRow={this.renderRow}>
      </ListView>
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
