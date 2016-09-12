
'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  View,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Text,
    Use,
    Defs,
    Stop
} from 'react-native-svg';

let _ = require('lodash');

let styles = {
  svg: {
    borderWidth: 1,
    borderColor: '#ccc'
  }
};

class TreeView extends Component {

  render() {

    if (!this.props.nodes) {
      return null;
    }

    let edges = _.map(this.props.edges, (edge, idx) => {
      return (
        <Line id={edge.id} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke={edge.stroke}
              strokeWidth={edge.strokeWidth}
              key={edge.id}
        />
      )
    });

    let nodes = _.map(this.props.nodes, (node, idx) => {
      return (
        <Circle id={node.id} cx={node.x} cy={node.y} r={node.r} fill={node.fill} stroke={node.stroke} strokeWidth={node.strokeWidth}
                onPress={() => this.props.onPressNode(node)}
                key={node.id}
        />
      )
    });

    return (
      <Svg height="500" width="600" style={styles.svg}>
        {edges}
        {nodes}
      </Svg>
    )
  }

  onPressIn() {
    console.log('press in');
  }
}

module.exports = TreeView
