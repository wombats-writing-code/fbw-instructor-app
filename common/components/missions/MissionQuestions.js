// MissionQuestions.js

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
  Text,
  TouchableHighlight,
  View,
  } from 'react-native';

var _ = require('lodash');

var AssessmentItemConstants = require('../../constants/AssessmentItem');
var AssessmentItemDispatcher = require('../../dispatchers/AssessmentItem');
var QuestionCard = require('./QuestionCard');
var UserStore = require('../../stores/User');


var styles = StyleSheet.create({
  header: {
    margin: 5
  },
  headerText: {
    color: 'gray',
    fontSize: 10,
    textAlign: 'center'
  },
  notification: {
    backgroundColor: '#ff9c9c',
    padding: 3
  },
  notificationText: {
    fontSize: 10,
    padding: 5
  }
});


class MissionQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allItems: [],
      height: 0,
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
    this.setState({ height: Dimensions.get('window').height });
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
  renderItemRow = (rowData, sectionId, rowId) => {
    // rowId is index of the row
    return <View key={rowData.id}>
      <QuestionCard index={rowId}
                    item={rowData}
                    numItems={this.props.missionItems.length}
                    removeItem={this._removeItemFromMission}
                    swapItems={this._swapItems} />
    </View>
  }
  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      currentItems = this.props.missionItems.length > 0 ?
                       ( <ListView dataSource={ds.cloneWithRows(this.props.missionItems)}
                                   renderRow={this.renderItemRow}>
                         </ListView> ) :
                       ( <View style={styles.notification}>
                           <Text style={[styles.notificationText]}>No questions</Text>
                         </View> );
    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>
          <TouchableHighlight onPress={() => this.props.toggleQuestionDrawer()}
                              style={styles.header}>
            <Text style={styles.headerText}>
              Tap here to toggle the "Add Question" drawer.
            </Text>
          </TouchableHighlight>
          <ScrollView onScroll={(event) => {console.log('scroll!')}}
                      style={ {height: this.state.height - 100 } }>
            {currentItems}
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
  _swapItems = (index1, index2) => {
    // semantically, this swaps the items' positions
    // i.e. moving "up" (in the UI) would
    //   mean the question at index2 is "moved up"
    //   to occur before the question previously at index1
    var updatedMissionItems = this.props.missionItems,
      placeholder = updatedMissionItems[index1];

    updatedMissionItems[index1] = updatedMissionItems[index2];
    updatedMissionItems[index2] = placeholder;

    this._sendUpdatedItems(updatedMissionItems);
  }
  _removeItemFromMission = (item) => {
    var updatedMissionItems = [];

    _.each(this.props.missionItems, function (missionItem) {
      if (missionItem.id != item.id) {
        updatedMissionItems.push(missionItem);
      }
    });

    this._sendUpdatedItems(updatedMissionItems);
  }
  _sendUpdatedItems = (updatedItems) => {
    AssessmentItemDispatcher.dispatch({
      type: AssessmentItemConstants.ActionTypes.SET_ITEMS,
      content: {
        assessmentId: this.props.mission.id,
        bankId: UserStore.getData().bankId,
        items: updatedItems
      }
    });
  }
}

module.exports = MissionQuestions;
