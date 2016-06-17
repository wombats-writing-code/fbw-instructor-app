// MissionDetails.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  DatePickerIOS,
  Dimensions,
  ListView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  } from 'react-native';

var AssessmentConstants = require('../../constants/Assessment');

var ActionTypes = AssessmentConstants.ActionTypes;
var AssessmentStore = require('../../stores/Assessment');
var DateConvert = require('../../../utilities/dateUtil/ConvertDateToDictionary');
var Dispatcher = require('../../dispatchers/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;
var MissionQuestions = require('./MissionQuestions');
var MissionStatus = require('../../../utilities/dateUtil/CheckMissionStatus');

var styles = StyleSheet.create({
  activeHeaderText: {
    color: '#2A47C9',
    textDecorationLine: 'underline'
  },
  container: {
    flex: 1
  },
  header: {
    flex: 1,
    flexDirection: 'row'
  },
  headerOption: {
    flex: 1,
    margin: 10
  },
  headerText: {
    color: '#ACAFBD',
    fontSize: 20
  },
  textRight: {
    textAlign: 'right'
  }
});


class MissionDetails extends Component {
  constructor(props) {
    super(props);
    var missionStatus = MissionStatus(this.props.mission);

    this.state = {
      loadingItems: true,
      missionStatus: missionStatus,
      opacity: new Animated.Value(0),
      selectedPane: 'items'
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
    // issue with styling DatePickerIOS:
    // https://github.com/facebook/react-native/issues/1587
//    if (this.refs.startDateDatepicker && this.refs.deadlineDatePicker) {
//      this.refs.startDateDatepicker.refs.datepicker.setNativeProps({width: Window.width - 500});
//      this.refs.deadlineDatePicker.refs.datepicker.setNativeProps({width: Window.width - 100});
//    }
  }
  createAssessment() {
    var data = {
      bankId: this.props.bankId,
      deadline: DateConvert(this.state.missionDeadline),
      description: 'A Fly-by-Wire mission',
      displayName: this.state.missionDisplayName,
      startTime: DateConvert(this.state.missionStartDate)
    };

    if (this.state.inClass) {
      data.genusTypeId = GenusTypes.IN_CLASS;
    } else {
      data.genusTypeId = GenusTypes.HOMEWORK;
    }

    Dispatcher.dispatch({
        type: ActionTypes.CREATE_ASSESSMENT,
        content: data
    });

    this.props.closeAdd();
  }
  onLayout = (event) => {
    // TODO: how to make this height change when device is rotated?
    // This doesn't get called -- why not??? Docs say it should, on mount and on layout change...
    console.log('onLayout called');
    this.setState({ height: Dimensions.get('window').height });
  }
  renderItemRow = (rowData, sectionId, rowId) => {

  }
  render() {
    var questionStyles = [styles.headerText],
      metadataStyles = [styles.headerText, styles.textRight],
      missionContent = <View />;

    if (this.state.selectedPane == 'items') {
      questionStyles.push(styles.activeHeaderText);
      missionContent = <MissionQuestions bankId={this.props.bankId}
                                         mission={this.props.mission}
                                         missionItems={this.props.missionItems}
                                         toggleQuestionDrawer={this.props.toggleQuestionDrawer} />;
    } else {
      metadataStyles.push(styles.activeHeaderText);
    }

    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this._changeContent('items') }
                                style={styles.headerOption}>
              <Text style={questionStyles}>
                Questions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._changeContent('metadata') }
                                style={styles.headerOption}>
              <Text style={metadataStyles}>
                Name & Dates
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.View style={{opacity: this.state.contentOpacity}}>
          <View>
            {missionContent}
          </View>
        </Animated.View>
      </View>
    );
  }
  _changeContent = (newContent) => {
    this.setState({ selectedPane: newContent });
  }
}

module.exports = MissionDetails;