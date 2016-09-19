// SimpleLogin.styles.js
'use strict';

import {
  StyleSheet
} from "react-native";

var fbwColors = require('../../constants/Colors');

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF6F69',
    flex: 1,
    justifyContent: 'center',
  },
  usernameInput: {
    fontSize: 20,
    textAlign: 'center',
    height: 42,
    color: '#fff',
    paddingTop: 10.5,
    paddingBottom: 10.5
  },
  loginButton: {
    width: 300,
    backgroundColor: 'transparent',
    margin: 10,
    padding: 10.5,
    borderColor: '#fff',
    borderWidth: 3,
    borderRadius: 5
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: "600"
  },
  loginPanel: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 75,
    padding: 10
  },
});

module.exports = styles;
