
'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated, Easing,
  Dimensions,
  ListView, ScrollView,
  Text, Image, View,
  StyleSheet,
  TouchableHighlight, TouchableOpacity,
  } from 'react-native';

var _ = require('lodash');

let {width, height} = Dimensions.get('window');

let styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -300,
    left: 0,
    right: 0,
    justifyContent: 'center',
    width: width,
    height: height,
    backgroundColor: '#96CEB4'
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10
  }
});

class EditDirective extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fadeInAnimation: new Animated.Value(0),
      moveUpAnimation: new Animated.Value(0)
    };
  }

  componentDidMount() {
    console.log('EditDirective did mount');

    Animated.parallel([
      Animated.timing(this.state.fadeInAnimation, {
        toValue: 1,
        duration: 600
      }),
      Animated.timing(this.state.moveUpAnimation, {
        toValue: 0,
        duration: 600
      })
    ])
    .start();
  }

  render() {
    return (
      <Animated.View style={[styles.container, {opacity: this.state.fadeInAnimation, top: this.state.moveUpAnimation}]}>
        <TouchableOpacity onPress={this.props.onClose} style={styles.closeButton}>
          <Image source={require('../../../assets/cancel--light.png')}></Image>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

module.exports = EditDirective
