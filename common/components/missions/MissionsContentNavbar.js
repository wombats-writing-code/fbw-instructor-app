// MissionsContentNavbar.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  Text,
  ListView,
  ScrollView,
  View,
  TouchableHighlight,
  Image
} from 'react-native';

var _ = require('lodash');
var styles = require('./Navigator.styles.js');

class MissionsContentNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0)
    }
  }
  componentWillUnmount() {
    Animated.timing(this.state.opacity, {
      toValue: 0
    }).start();
  }
  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1
    }).start();
  }
  render() {
    var toggleSidebar = <View/>;

    if (!this.props.sidebarOpen) {
      toggleSidebar = (
        <TouchableHighlight onPress={() => this.props.toggleSidebar()}
                              >
            <Image
              source={require('./assets/menu-icon.png')}
            />
      </TouchableHighlight> );
    }

    return (
        <Animated.View style={{opacity: this.state.opacity}}>
          <View style={styles.navBar}>
            {toggleSidebar}

            <View style={styles.titleWithSubtitle}>
              <View style={styles.titleWrapper}>
                  <Text style={styles.title}>{(this.props.title || '').toUpperCase()}</Text>
              </View>
              <View style={styles.subtitleWrapper}>
                  <Text style={styles.subTitle}>{(this.props.subtitle || '').toUpperCase()}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
    );
  }
}

module.exports = MissionsContentNavbar;
