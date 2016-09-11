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
    marginTop: 60,
    flex: 3
  },
  dashboardNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 18
  },
  dashboardNavButton: {
    padding: 9,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  selectedButton: {
    borderColor: '#888'
  },
  buttonText: {
    color: '#666',
    fontWeight: "500",
    letterSpacing: 1
  }
});

import TreeView from './tree-view/TreeView'

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeView: 'outcomesView',
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
    let questionsView;
    if (this.state.activeView === 'questionsView') {

    }

    let treeView;
    if (this.state.activeView === 'outcomesView') {
      treeView = (
        <ScrollView>
          <TreeView nodes={this._getNodes()} edges={this._getEdges()}
                    onPressNode={this.handlePressNode} />
        </ScrollView>
      )
    }

    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>
        <View style={styles.dashboardNav}>
          <TouchableHighlight style={[styles.dashboardNavButton, this.state.activeView === 'questionsView' ? styles.selectedButton : null]}
              onPress={() => this.setState({activeView: 'questionsView'})}>
            <Text style={styles.buttonText}>QUESTIONS</Text>
          </TouchableHighlight>

          <TouchableHighlight style={[styles.dashboardNavButton, this.state.activeView === 'outcomesView' ? styles.selectedButton : null]}
              onPress={() => this.setState({activeView: 'outcomesView'})}>
            <Text style={styles.buttonText}>OUTCOMES</Text>
          </TouchableHighlight>
        </View>

          {questionsView}
          {treeView}

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
