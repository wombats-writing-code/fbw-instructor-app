// MissionsCalendar.js

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
  StyleSheet
} from 'react-native';

var styles = StyleSheet.create({
  container: {
    flex: 3
  }
});

import TreeView from './tree-view/TreeView'

class Dashboard extends Component {
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
    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>
          <ScrollView>
            <Text>Dashboard</Text>

            <View>
              <Text></Text>
            </View>

            <TreeView nodes={this._getNodes()} edges={this._getEdges()}
                      onPressNode={this.handlePressNode} />

          </ScrollView>
        </Animated.View>
      </View>
    );
  }

  handlePressNode(node) {
    console.log('node was pressed', node);
  }

  // below are just dummy methods. will compute real stuff later

  _getNodes() {
    return _.map(_.range(0, 5), (idx) => {
      return {
        id: idx + '-dummy-node',
        x: idx*100 + 50,
        y: _.random(30, 80),
        r: 20,
        fill: '#FFEEAD',
        stroke: '#cccccc',
        strokeWidth: 1
      }
    });
  }

  _getEdges() {
    return _.map(_.range(0, 5), (idx) => {
      return {
        id: idx + '-dummy-edge',
        x1: idx*100 + 50,
        y1: _.random(30, 80),
        x2: _.random(30, 500),
        y2: _.random(80, 500),
        stroke: '#cccccc',
        strokeWidth: 1
      }
    });
  }

}

module.exports = Dashboard;
