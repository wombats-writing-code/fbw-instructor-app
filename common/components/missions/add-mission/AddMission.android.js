// AddMission.android.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Text,
  ListView,
  ScrollView,
  View,
  ActivityIndicatorIOS,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

var styles = StyleSheet.create({
  cancelButton: {

  },
  container: {
    flex: 3,
    padding: 5
  },
  createButton: {

  },
});


class AddMission extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentWillUnmount() {
  }
  componentDidMount() {
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text>
            A mission creator!
          </Text>
        </ScrollView>
      </View>
    );
  }
}

module.exports = AddMission;