// MissionsCalendar.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  Text,
  ListView,
  ScrollView,
  View,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

var styles = StyleSheet.create({
  container: {
    flex: 3
  }
});


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0)
    }
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
  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>
          <ScrollView>
            <Text>Dashboard</Text>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

module.exports = Dashboard;
