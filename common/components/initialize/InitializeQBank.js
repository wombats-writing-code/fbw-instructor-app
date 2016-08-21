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
    paddingTop: 80
  },
  messageText: {
    color: '#fff',
    fontWeight: "300",
    fontSize: 14,
    letterSpacing: 5,
    textAlign: 'center'
  },
  messageWrapper: {
    margin: 10
  }
});

class InitializeQBank extends Component {
  constructor(props) {
    super (props);

    this.state = {
    };
  }
  componentDidMount() {
    let _this = this;
    AuthorizationStore.setAuthorizations(this.props.payload)
      .then((res) => {
        console.log("done setting authz");
        _this.props.callback(true);
      })
      .catch((error) => {
        _this.props.callback(false);
      })
      .done();
  }
  render() {
    return <View style={styles.container}>
      <View style={styles.messageWrapper}>
        <Text style={styles.messageText}>
          Looks like this is your first time using Fly-by-Wire.
        </Text>
      </View>
      <View style={styles.messageWrapper}>
        <Text style={styles.messageText}>
          Please wait while we initialize your account.
        </Text>
      </View>
      <View style={styles.messageWrapper}>
        <Text style={styles.messageText}>
          We will redirect you to Mission Control, shortly ...
        </Text>
      </View>
      <ActivityIndicator size="large" />
    </View>;
  }
}

module.exports = InitializeQBank;
