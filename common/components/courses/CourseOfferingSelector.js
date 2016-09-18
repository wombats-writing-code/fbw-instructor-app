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

    var rowStyles = [styles.courseWrapper];
    if (rowData.id == this.props.courseOfferingId) {
      rowStyles.push(styles.missionWrapperSelected);
    }

    return ( // TODO: Change this onPress call depending on what is swiped / touched
        <TouchableHighlight key={rowData.id}
                            onPress={() => this._setCourse(rowData.id)}
                            style={rowStyles}>

          <View style={styles.courseRow}>
              <Text style={styles.rowTitle}
                  numberOfLines={2}>
                {(rowData.name || '').toUpperCase()}
              </Text>
              <Text style={styles.rowSubtitle}>
                {(rowData.term || '').toUpperCase()}
              </Text>
          </View>
        </TouchableHighlight>);
  }
  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    return (
      <View style={styles.container}>
        <ListView
              dataSource={ds.cloneWithRows(this.props.subjects)}
              renderRow={this.renderRow}>
        </ListView>
      </View>);
  }
  _setCourse = (courseId) => {
    this.props.setCourse(courseId);
  }
}

module.exports = CourseOfferingSelector;
