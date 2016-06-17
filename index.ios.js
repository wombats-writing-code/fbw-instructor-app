/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    Component,
} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

var FbWNavigator = require('./common/components/Navigator');

class FbW extends Component {
  render() {
    return (
      <FbWNavigator>
      </FbWNavigator>
    );
  }
}

AppRegistry.registerComponent('FbW', () => FbW);
