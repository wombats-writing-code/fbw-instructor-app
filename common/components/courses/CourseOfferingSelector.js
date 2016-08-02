// CourseOfferingSelector.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ActivityIndicator,
  ListView,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native';

var _ = require('lodash');
var UserStore = require('../../stores/User');

var styles = require('./CourseOfferingSelector.styles');

class CourseOfferingSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }
  componentWillUnmount() {
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
  }
  renderRow = (rowData, sectionId, rowId) => {
    // change icon that appears depending on now time vs. item deadline + startTime
    var missionTypeIcon = '',
      progressIcon = '',
      rowStyles = [styles.missionWrapper],
      swipeButtons = [{
        text: 'Edit',
        backgroundColor: 'green',
        onPress: () => {this._editMission(rowData)}
      }, {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => {this._deleteMission(rowData)}
      }];
    if (rowData.id == this.props.courseOfferingId) {
      rowStyles.push(styles.missionWrapperSelected);
    }

    return ( // TODO: Change this onPress call depending on what is swiped / touched
        <TouchableHighlight key={rowData.id}
                            onPress={() => this._setCourse(rowData.id)}
                            style={rowStyles}>

          <View style={styles.missionRow}>
            <View style={styles.missionInformation}>
                <Text
                    style={styles.missionTitle}
                    numberOfLines={2}>
                  {(rowData.name || '').toUpperCase()}
                </Text>
              <View>
                <Text style={styles.missionSubtitle}>
                  {(rowData.term || '').toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>);
  }
  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      userCourses = this.props.subjects.length > 0 ?
                  ( <ListView
                        dataSource={ds.cloneWithRows(this.props.subjects)}
                        renderRow={this.renderRow}>
                    </ListView> ) :
                  ( <View style={[styles.notification, styles.rounded]} >
                    <Text style={styles.notificationText}>
                      You are not an instructor in a FbW course.
                    </Text>
                  </View> );

    return ( <View style={styles.container}>
      <View style={styles.courseInformation}>
        <Text style={styles.missionTitle}>Your FbW Courses</Text>
      </View>
      <View style={[styles.courseOfferingsListWrapper]}>
        <ScrollView style={styles.courseOfferingsList}>
          {userCourses}
        </ScrollView>
      </View>
    </View>);
  }
  _setCourse = (courseId) => {
    this.props.setCourse(courseId);
  }
}

module.exports = CourseOfferingSelector;
