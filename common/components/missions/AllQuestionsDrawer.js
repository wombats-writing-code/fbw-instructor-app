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

var styles = require('./AllQuestionsDrawer.styles');


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
                       ( <View style={styles.noQuestionsIndicator}>
                           <Text style={[styles.noQuestionsIndicatorText]}>No questions</Text>
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
