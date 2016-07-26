
'use strict';
import React, {
    Component,
} from 'react';

import {
  ActivityIndicator,
  ListView,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  View
  } from 'react-native';

var _ = require('lodash');

let styles = StyleSheet.create({
  cell: {
    paddingLeft: 10.5,
    paddingTop: 21,
    paddingBottom: 21,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  cellTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: "300"
  }
});

class DirectiveList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
  }

  renderRow(directive) {
    console.log(directive);

    return (
      <TouchableHighlight key={directive.id}>
        <View style={styles.cell}>
          <Text style={styles.cellTitle}>{directive.displayName}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <ListView dataSource={this.state.ds.cloneWithRows(this.props.directives)}
              renderRow={this.renderRow}>
      </ListView>
    )
  }

}

module.exports = DirectiveList
