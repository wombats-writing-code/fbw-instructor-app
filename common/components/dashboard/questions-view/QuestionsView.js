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
  View, Image,
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
import {isTarget} from '../../../selectors/selectors'

let styles = require('./QuestionsView.styles')

class QuestionsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
  }

  renderRow = (questionWithComputed) => {

    if (questionWithComputed.numStudentsDidNotAchieve === 0) {
      return null;
    }

    let questionTypeIcon;
    if (isTarget(questionWithComputed)) {
      questionTypeIcon = <Image style={styles.questionTypeIcon} source={require('../../../assets/target-question.png')} />
    } else {
      questionTypeIcon = <Image style={styles.questionTypeIcon} source={require('../../../assets/waypoint-question.png')} />
    }

    return (
      <View style={styles.row}>
        <View style={styles.questionWrapper}>
          {questionTypeIcon}
          <View style={styles.questionTextWrapper}>
            <MathWebView content={questionWithComputed.text.text} />
          </View>
          <View style={styles.attemptsTextWrapper}>
            <Text style={styles.numStudentsDidNotAchieve}>{questionWithComputed.numStudentsDidNotAchieve}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableHighlight style={styles.getAnotherQuestionButton} onPress={_.noop} >
            <Text style={styles.getAnotherQuestionButtonText}>Get another question</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.seeStudentResponsesButton} onPress={_.noop} >
            <Text style={styles.seeStudentResponsesButtonText}>See student responses</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  render() {
    let questionsList = uniqueQuestions(this.props.takenResults);
    let questionsWithComputed = _.orderBy(_.map(questionsList, (question) => {
      let didNotAchieveTakens = notCorrectWithinAttempts(question.itemId, this.props.takenResults, this.props.maxAttempts);

      return _.assign({}, question, {
        numStudentsDidNotAchieve: didNotAchieveTakens.length
      })
    }), ['numStudentsDidNotAchieve'], ['desc']);


    console.log('taken results', this.props.takenResults);
    console.log('questionsWithComputed', questionsWithComputed);
    // console.log('questionsList', questionsList)

    return (
      <ListView dataSource={this.state.ds.cloneWithRows(questionsWithComputed)}
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
