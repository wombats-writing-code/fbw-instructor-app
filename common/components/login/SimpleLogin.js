// SimpleLogin.js
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
  View
} from "react-native";
import {
  Actions
} from "react-native-router-flux";

var {
  height: deviceHeight
} = Dimensions.get("window");

var UserStore = require('../../stores/User');

var styles = require('./SimpleLogin.styles');

class SimpleLogin extends Component {
  constructor(props) {
    super (props);

    this.state = {
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
    return <View style={styles.container}>
        <TextInput autoCapitalize="none"
                   autoCorrect={false}
                   autoFocus={true}
                   onChangeText={(text) => this.setState({ username: text })}
                   placeholder="Username"
                   placeholderTextColor="#ddd"
                   style={styles.usernameInput}
                   value={this.state.username} />
        <Picker onValueChange={(school) => this.setState({ school: school })}
                selectedValue={this.state.school}>
          <Picker.Item label="ACC" value="acc" />
          <Picker.Item label="QCC" value="qcc" />
        </Picker>

        <View style={styles.loginPanel}>
          <TouchableHighlight onPress={() => this._loginUser()}
                              style={styles.loginButton}>
            <Text style={styles.loginButtonText}>
              Login
            </Text>
          </TouchableHighlight>
        </View>

    </View>;
  }
  _loginUser = () => {
    // in an OAuth-ish login, this should be the token?
    if (this.state.username == '') {
      Actions.error({
        message: 'You must supply a username'
      })
    } else {
      UserStore.setSchool(this.state.school);
      UserStore.setUsernameSimple(this.state.username, () => {
          Actions.missions({
          });
        }
      );
    }
  }
}

module.exports = SimpleLogin;
