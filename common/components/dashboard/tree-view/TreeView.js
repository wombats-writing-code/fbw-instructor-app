
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
let ModuleStore = require('../../../stores/Module');

let styles = {
  svg: {
    borderWidth: 1,
    borderColor: '#ccc'
  }
};

class TreeView extends Component {
  render() {
    let layout = this.props.layout;

    if (!(layout && layout.nodes && layout.links)) {
      return null;
    }

    // render edges as lines
    let edges = _.map(layout.links, (edge, idx) => {
      console.log('edge', edge.x1, edge.y1);
      return (
        <Line id={edge.id} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke={edge.stroke}
              strokeWidth={edge.strokeWidth}
              key={edge.id}
        />
      )
    });


    // render nodes as circles
    let nodes = _.map(layout.nodes, (node, idx) => {
      console.log('node', node.x, node.y);
      return (
        <Circle id={node.id} cx={node.x} cy={node.y} r={node.r}
                fill={node.fill} stroke={node.stroke} strokeWidth={node.strokeWidth}
                onPress={() => this.props.onPressNode(node)}
                key={node.id}
        />
      )
    });

    // render nodeBottomLabels
    let nodeBottomLabels = _.map(layout.nodeBottomLabels, (label, idx) => {
      // console.log(label);
      return (
        <Text key={idx+1} x={label.x} y={label.y} fontSize={label.fontSize} lineHeight={label.lineHeight}>
          {label.text || ''}
        </Text>
      )
    });

    return (
      <Svg height="500" width="600" style={styles.svg}>
        {edges}
        {nodes}
        {nodeBottomLabels}
      </Svg>
    )
  }

  onPressIn() {
    console.log('press in');
  }
}

module.exports = TreeView
