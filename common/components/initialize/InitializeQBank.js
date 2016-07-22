// InitializeQBank.js
'use strict';

import React, {
    Component,
}  from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import {
  Actions
} from "react-native-router-flux";

var AuthorizationStore = require('../../stores/Authorization');

var {
  height: deviceHeight
} = Dimensions.get("window");

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#3498DB',
    flex: 1,
    paddingTop: 200
  },
  messageText: {
    color: '#fff',
    fontWeight: "300",
    fontSize: 14,
    letterSpacing: 5,
  }
});

class InitializeQBank extends Component {
  constructor(props) {
    super (props);

    this.state = {
    };
  }
  componentDidMount() {
    console.log('setting authz');
    console.log(this.props.payload);
    AuthorizationStore.setAuthorizations(this.props.payload,
      this.props.callback);
  }
  render() {
    return <View style={styles.container}>
      <Text style={styles.messageText}>
        Initializing your Fly-by-Wire Account. Please be patient.
      </Text>
      <ActivityIndicator size="large" />
    </View>;
  }
}

module.exports = InitializeQBank;
