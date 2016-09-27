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
    backgroundColor: '#FF6F69',
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
        Actions.missions();
      } else {
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
