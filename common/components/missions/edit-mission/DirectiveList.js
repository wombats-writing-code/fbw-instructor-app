
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
    flexDirection: 'row',
    paddingLeft: 10.5,
    paddingRight: 10.5,
    paddingTop: 21,
    paddingBottom: 21,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
  },
  cellInfoWrapper: {
    flex: 9,
  },
  cellTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: "300"
  },
  countIndicator: {
    fontSize: 18,
    color: '#96CEB4',
    flex: 1
  }
});

class DirectiveList extends Component {

  constructor(props) {
    super(props)

    console.log('in DirectiveList', props);

    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    }
  }

  renderRow = (directive) => {

    return (
      <TouchableHighlight style={{marginBottom: 21}} key={directive.id} onPress={() => this.props.onSelectDirective(directive)}>
        <View style={styles.cell}>
          <View style={styles.cellInfoWrapper}>
            <Text style={styles.cellTitle}>{directive.displayName}</Text>
            {_.map(this.props.itemsByDirectiveId[directive.id], (item) => {
              return (
                <Text style={styles.cellSubTitle}>Item name goes here item.question.text.text</Text>
              )
            })}
          </View>
          <Text style={styles.countIndicator}>{1} of {3}</Text>

        </View>
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <ListView style={[styles.listView, this.props.style]}
              dataSource={this.state.ds.cloneWithRows(this.props.directives)}
              renderRow={this.renderRow}>
      </ListView>
    )
  }


}

module.exports = DirectiveList
