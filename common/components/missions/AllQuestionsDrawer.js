// AllQuestionsDrawer.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  Dimensions,
  ListView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  } from 'react-native';

var _ = require('lodash');

var AssessmentConstants = require('../../constants/Assessment');

var ActionTypes = AssessmentConstants.ActionTypes;
var AssessmentStore = require('../../stores/Assessment');
var AssessmentItemStore = require('../../stores/AssessmentItem');
var Dispatcher = require('../../dispatchers/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;
var QuestionAccordion = require('./QuestionAccordion');

var credentials = require('../../constants/credentials');
var DateConvert = require('fbw-utils')(credentials).ConvertDateToDictionary;

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // top: 0,
    left: 0,
    width: 300,
    backgroundColor: '#2B2B2B',
    // opacity: 0.9
  },
  header: {
    paddingTop: 30,
    padding: 3
  },
  headerText: {
    color: '#C2C2C2',
    textAlign: 'center'
  },
  notification: {
    backgroundColor: '#ff9c9c',
    padding: 3
  },
  notificationText: {
    fontSize: 10,
    padding: 5
  },
  separator: {
    borderColor: '#C2C2C2',
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5
  }
});


class AllQuestionsDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillUnmount() {
  }
  componentDidMount() {
  }
  componentDidUpdate() {
  }
  onLayout = (event) => {
    // TODO: how to make this height change when device is rotated?
    // This doesn't get called -- why not??? Docs say it should, on mount and on layout change...
    console.log('onLayout called');
    this.setState({ height: Dimensions.get('window').height });
  }
  setItems(items) {
    this.setState({ items: items });
  }
  render() {

    // TODO: make this a set of collapsible accordions with <ListView> inside of each...
    // TODO: close X button
    var currentItems = _.keys(this.props.items).length > 0 ?
                       ( <QuestionAccordion items={this.props.items}
                                            missionItems={this.props.missionItems}
                                            updateItemsInMission={this.props.updateItemsInMission} /> ) :
                       ( <View style={styles.notification}>
                           <Text style={[styles.notificationText]}>No questions</Text>
                         </View> );
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Curated Questions
          </Text>
        </View>
        <View style={styles.separator} />
        <ScrollView>
          {currentItems}
        </ScrollView>
      </View>
    );
  }
}

module.exports = AllQuestionsDrawer;
