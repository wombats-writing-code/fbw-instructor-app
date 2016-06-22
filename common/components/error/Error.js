// Error.js
'use strict';

import React, {
    Component,
}  from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import {
  Actions
} from "react-native-router-flux";

var {
  height: deviceHeight
} = Dimensions.get("window");

var styles = StyleSheet.create({
  closeButton: {
    backgroundColor: '#cb213d',
    borderRadius: 5,
    borderWidth: 1,
    margin: 10,
    padding: 10
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center'
  },
  error: {
    alignItems: "center",
    backgroundColor: "#E25E75",
    bottom:0,
    justifyContent: "center",
    left:0,
    position: "absolute",
    right:0,
    top:0
  },
  errorMessageText: {
    color: 'white'
  }
});

class Error extends Component {
  constructor(props) {
    super (props);

    this.state = {
      offset: new Animated.Value(-deviceHeight)
    };
  }
  componentDidMount() {
    Animated.timing(this.state.offset, {
      duration: 150,
      toValue: 0
    }).start();
  }
  closeModal = () => {
    Animated.timing(this.state.offset, {
      duration: 150,
      toValue: -deviceHeight
    }).start(Actions.pop);
  }
  render() {
    return <Animated.View style={[styles.error,
                                  {transform: [{translateY: this.state.offset}]}]}>
      <View>
        <Text style={styles.errorMessageText}>
          {this.props.message}
        </Text>
        <TouchableHighlight onPress={() => this.closeModal()}
                            style={styles.closeButton}>
          <Text style={styles.closeButtonText}>
            Close
          </Text>
        </TouchableHighlight>
      </View>
    </Animated.View>;
  }
}

module.exports = Error;