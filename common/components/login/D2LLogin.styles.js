// D2LLogin.styles.js
'use strict';

import {
  StyleSheet
} from "react-native";

var fbwColors = require('../../constants/Colors');

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#3498DB',
    flex: 1,
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: '#c9c097',
    margin: 10,
    padding: 10,
  },
  loginButtonText: {
    textAlign: 'center',
    fontWeight: "700"
  },
  loginPanel: {
    height: 75,
    padding: 10
  },
  schoolPrompt: {
    fontSize: 20,
    textAlign: 'center',
    height: 42,
    color: '#fff',
    paddingTop: 10.5,
    paddingBottom: 10.5
  },
});

module.exports = styles;
