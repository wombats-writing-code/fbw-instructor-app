// The following is mostly from React-Native UI Examples:
// https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/Navigator/NavigationBarSample.js

'use strict';
import React, {
    Component,
} from 'react';
import {
  Navigator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

var _ = require('lodash');
var Orientation = require('react-native-orientation');

var BankSelector = require('./bank-selector/BankSelector');
var MissionsManager = require('./missions/MissionsManager');

var styles = StyleSheet.create({
  navigator: {
  },
  navBar: {
    height: 1
  },
  navBarText: {
    fontSize: 16,
  },
  navBarTitleText: {
    color: 'white',
    fontWeight: '500',
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#cccccc',
  },
  scene: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
});
var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {previousRoute.title}
        </Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    return null;
  },

  Title: function(route, navigator, index, navState) {
    return null;
//    return (
//      <Text style={[styles.navBarText, styles.navBarTitleText]}>
//        {route.title}
//      </Text>
//    );
  },

};


var FbWNavigator = React.createClass({
    statics: {
        title: 'Fly-by-Wire',
        description: 'Fly-by-Wire educational app'
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {
//        Orientation.lockToLandscape();
    },
    componentWillUnmount: function() {
    },
    render: function () {
        return <Navigator style={styles.navigator}
                          initialRoute={{id: 'missions', title: 'Missions', index: 0}}
                          renderScene={(route, nav) =>
                            {return this.renderScene(route, nav)}}
                          navigationBar={
                  <Navigator.NavigationBar
                    routeMapper={NavigationBarRouteMapper}
                    style={styles.navBar}
                  />
                }
        />
    },
    renderScene: function (route, nav) {
        switch (route.id) {
            case "missions":
                return <MissionsManager navigator={nav} />
            case "banks":
                return <BankSelector navigator={nav} />

        }
    }
});

module.exports = FbWNavigator;