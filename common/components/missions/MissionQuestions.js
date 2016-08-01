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
  PanResponder
  } from 'react-native';

var _ = require('lodash');

var AssessmentItemConstants = require('../../constants/AssessmentItem');
var AssessmentItemDispatcher = require('../../dispatchers/AssessmentItem');
var QuestionCard = require('./QuestionCard');
var UserStore = require('../../stores/User');


var styles = StyleSheet.create({
  container: {
    position:'relative'
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  draggable: {
    flex: 2,
    position: 'absolute',
  },
  addQuestionsButton: {
    color: '#444',
    textAlign: 'right'
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
      currentQuestionId: null,
      pan     : new Animated.ValueXY() ,
      allItems: [],
      height: 0,
      opacity: new Animated.Value(0)
    };


    // TODO: not done
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder : () => {
        return true;
      },
      onPanResponderMove: Animated.event([ null,
        {
          dx : this.state.pan.x,
          dy : this.state.pan.y
      }]),
      onPanResponderRelease: (e, gesture) => {

      }
    });
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
  }
  onLayout = (event) => {
    this.setState({ height: Dimensions.get('window').height });
  }
  renderItemRow = (rowData, sectionId, rowId) => {
    // rowId is index of the row
    return (<Animated.View {...this.panResponder.panHandlers} key={rowData.id}>
          <QuestionCard index={rowId}
                        item={rowData}
                        isActive={this.state.currentQuestionId === rowData.id}
                        onLongPress={this._setCurrentQuestion}

                        numItems={this.props.missionItems.length}
                        removeItem={this._removeItemFromMission}
                        swapItems={this._swapItems} />
        </Animated.View>)
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
        <View style={styles.controls}>
          <Animated.View style={{opacity: this.state.opacity}}>
            <TouchableHighlight onPress={() => this.props.toggleQuestionDrawer()}>
              <Text style={styles.addQuestionsButton}>
                Tap here to toggle the "Add Question" drawer.
              </Text>
            </TouchableHighlight>
          </Animated.View>
        </View>

        {currentItems}
      </View>
    );
  }
  // <ScrollView scrollEnabled={false} style={ {height: this.state.height - 100 } }>
  //   {currentItems}
  // </ScrollView>

  _setCurrentQuestion = (questionId) => {
    // this.panResponder.onStartShouldSetPanResponder();

    this.setState({currentQuestionId: questionId});
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
        items: updatedItems
      }
    });
  }
}

module.exports = MissionQuestions;
