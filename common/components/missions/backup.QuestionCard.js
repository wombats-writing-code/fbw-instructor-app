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

var AssessmentItemConstants = require('../../constants/AssessmentItem');
var MathJaxURL = AssessmentItemConstants.MathJax.URL;
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

    return (
      <Animated.View style={{opacity: this.state.opacity}}>
        <View style={styles.questionCard}>
          <View style={styles.questionActions}>
            <View style={styles.questionActionsWrapper}>
              <View style={styles.questionContent}>
                {moveUp}
              </View>
              <View style={styles.questionContent}>
                <TouchableHighlight onPress={() => this.props.removeItem(this.props.item)}>
                  <Icon name="trash"
                        size={20} />
                </TouchableHighlight>
              </View>
              <View style={styles.questionContent}>
                {moveDown}
              </View>
            </View>
          </View>
          <View style={styles.questionContent}>
            <View style={styles.questionDisplayNameWrapper}>
              <View style={styles.sectionLabel}>
                <Text>
                  Q:
                </Text>
              </View>
              <Text style={[styles.questionDisplayName, styles.sectionText]}>
                {this.props.item.question.displayName.text}
              </Text>
            </View>
            <View>
              <TouchableHighlight onPress={() => this._toggleLOState()}
                                  style={styles.toggleLOButton}>
                <Text style={styles.toggleControl}>
                  Toggle outcome
                </Text>
              </TouchableHighlight>
              <Animated.View style={[{height: this.state.loHeight}, styles.questionLOWrapper]}>
                <View style={styles.sectionLabel}>
                  <Icon name="crosshairs" />
                </View>
                <View style={styles.questionLOTextWrapper}>
                  <Text style={styles.sectionText}>
                    {questionLO.displayName.text}
                  </Text>
                </View>
              </Animated.View>
            </View>
            <View>
              <WebView scrollEnabled={false}
                       source={{html: this._wrapHTMLWithMathjax(this.props.item.question.text.text)}}
                       style={styles.questionText} />
            </View>
            <View>
              <View>
                <TouchableHighlight onPress={() => this._toggleChoiceState()}
                                    style={styles.toggleChoicesButton} >
                  <Text style={styles.toggleControl}>
                    Toggle choices
                  </Text>
                </TouchableHighlight>
              </View>
              <View style={styles.choicesContent}>
                <Animated.View style={{height: this.state.contentHeight}}>
                  <ListView dataSource={ds.cloneWithRows(this.props.item.question.choices)}
                            renderRow={this.renderChoices}>
                  </ListView>
                </Animated.View>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
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
  _toggleLOState = () => {
    var _this = this;
    this.setState({ loExpanded: !this.state.loExpanded }, function () {
      if (_this.state.loExpanded) {
        Animated.timing(_this.state.loHeight, {
          toValue: 75
        }).start();
      } else {
        Animated.timing(_this.state.loHeight, {
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
