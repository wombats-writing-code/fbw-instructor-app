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
var DateConvert = require('../../../utilities/dateUtil/ConvertDateToDictionary');
var Dispatcher = require('../../dispatchers/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;
var QuestionAccordion = require('./QuestionAccordion');

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#2B2B2B',
    flex: 1,
    opacity: 0.9
  },
  header: {
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
    // issue with styling DatePickerIOS:
    // https://github.com/facebook/react-native/issues/1587
//    if (this.refs.startDateDatepicker && this.refs.deadlineDatePicker) {
//      this.refs.startDateDatepicker.refs.datepicker.setNativeProps({width: Window.width - 500});
//      this.refs.deadlineDatePicker.refs.datepicker.setNativeProps({width: Window.width - 100});
//    }
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
