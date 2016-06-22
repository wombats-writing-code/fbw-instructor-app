// D2LLogin.js
'use strict';

import React, {
    Component,
}  from 'react';
import {
  Animated,
  Dimensions,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  WebView
} from "react-native";
import {
  Actions
} from "react-native-router-flux";

var credentials = require('../../credentials');
var D2L = require('valence');
var AppContext = new D2L.ApplicationContext(credentials.d2l.appID, credentials.d2l.appKey);


var {
  height: deviceHeight
} = Dimensions.get("window");

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#dddddd',
    flex: 1
  },
  d2lLoginView: {
    height: 200
  }
});

class D2LLogin extends Component {
  constructor(props) {
    super (props);

    this.state = {
      authenticationUrl: AppContext.createUrlForAuthentication(credentials.d2l.host,
        credentials.d2l.port,
        "flybywire://"),
      offset: new Animated.Value(-deviceHeight),
      school: 'acc',
      username: ''
    };
  }
  componentDidMount() {
    Animated.timing(this.state.offset, {
      duration: 150,
      toValue: 0
    }).start();
  }
  render() {
    console.log(this.state.authenticationUrl);
    return <View style={styles.container}>
      <WebView source={{uri: this.state.authenticationUrl }}
               style={styles.d2lLoginView} />
    </View>;
  }
  _authenticated = () => {
    console.log('authenticated!')
  }
  _loginUser = () => {
    // in an OAuth-ish login, this should be the token?
    if (this.state.username == '') {
      Actions.error({
        message: 'You must supply a username'
      })
    } else {
      Actions.missions({
        schoolId: this.state.school,
        username: this.state.username
      });
    }
  }
}

module.exports = D2LLogin;