// Loading.js
'use strict';

import React, {
    Component,
}  from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View
} from "react-native";
import {
  Actions
} from "react-native-router-flux";

var UserStore = require('../../stores/User');

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#3498DB',
    flex: 1,
    padding: 100
  }
});


class Loading extends Component {
  constructor(props) {
    super (props);

    this.state = {
    };
  }
  componentDidMount() {
    UserStore.hasSession((hasSession) => {
      if (hasSession) {
        console.log('has mission');
        Actions.missions();
      } else {
        console.log('no mission');
        Actions.login();
      }
    });
  }
  render() {
    return <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>;
  }
}

module.exports = Loading;
