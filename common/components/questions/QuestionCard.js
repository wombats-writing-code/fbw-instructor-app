// QuestionCard.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  Dimensions,
  ListView,
  Panel,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  WebView,
  } from 'react-native';

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');

var credentials = require('../../constants/credentials');
var MathJaxURL = credentials.MathJaxURL;
var ModuleStore = require('../../stores/Module');

var styles = require('./QuestionCard.styles.js');

class QuestionCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contentExpanded: false,
      contentHeight: new Animated.Value(0),
      loExpanded: true,
      loHeight: new Animated.Value(75),
      opacity: new Animated.Value(0)
    };
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
  }
  componentDidUpdate() {
  }
  onLayout = (event) => {
    // TODO: how to make this height change when device is rotated?
    // This doesn't get called -- why not??? Docs say it should, on mount and on layout change...
    console.log('onLayout called');
    this.setState({ height: Dimensions.get('window').height });
  }
  renderChoices = (rowData, sectionId, rowId) => {
    var choiceIcon = <View />;

    if (rowData.id == this.props.item.answers[0].choiceIds[0]) {
      choiceIcon = <Icon name="check" style={styles.rightAnswer} />
    }
    return <View key={rowData.id}
                 style={styles.choiceRow}>
      <View style={styles.choiceIconWrapper}>
        <View style={styles.choiceIcon}>
          {choiceIcon}
        </View>
      </View>
      <WebView scrollEnabled={false}
               source={{html: this._wrapHTMLWithMathjax(rowData.text)}}
               style={styles.choiceText} />
    </View>
  }
  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      questionLO = ModuleStore.getOutcome(this.props.item.learningObjectiveIds[0]),
      moveUp = <View />,
      moveDown = <View />,
      myIndex = parseInt(this.props.index),
      numItems = parseInt(this.props.numItems);

    if (myIndex != 0) {
      moveUp = <TouchableHighlight onPress={() => this.props.swapItems(myIndex - 1, myIndex)}>
        <Icon name="caret-up" size={20} />
      </TouchableHighlight>;
    }

    if (myIndex != (numItems - 1)) {
      moveDown = <TouchableHighlight onPress={() => this.props.swapItems(myIndex, myIndex + 1)}>
        <Icon name="caret-down" size={20} />
      </TouchableHighlight>
    }

    let questionCardStyle = [styles.questionCard, this.props.isActive && styles.questionCardActive];

    return (
        <TouchableHighlight delayLongPress={2000} onLongPress={() => this.props.onLongPress(this.props.item.id)}
          style={styles.questionCardWrapper}>

          <View style={questionCardStyle}>
            <Text style={styles.itemNumberSection}>
              {parseInt(this.props.index)+1}
            </Text>

            <Text style={styles.LOTextSection}>
              {questionLO.displayName.text}
            </Text>

            <View style={styles.questionContent}>
              <WebView scrollEnabled={false}
                       source={{html: this._wrapHTMLWithMathjax(this.props.item.question.text.text)}}
                       style={styles.questionText} />
             </View>
          </View>
        </TouchableHighlight>
    );
  }

  _toggleChoiceState = () => {
    var _this = this;
    this.setState({ contentExpanded: !this.state.contentExpanded }, function () {
      if (_this.state.contentExpanded) {
        Animated.timing(_this.state.contentHeight, {
          toValue: 50 * _this.props.item.question.choices.length
        }).start();
      } else {
        Animated.timing(_this.state.contentHeight, {
          toValue: 0
        }).start();
      }
    });
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

module.exports = QuestionCard;
