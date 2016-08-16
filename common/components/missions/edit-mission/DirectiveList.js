
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

import {getItemsByDirective} from '../../../selectors/selectors';

var ModuleStore = require('../../../stores/Module');

let styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    paddingLeft: 10.5,
    paddingRight: 10.5,
    paddingTop: 21,
    paddingBottom: 21,
  },
  cellInfoWrapper: {
    flex: 9,
  },
  cellTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: "300"
  },
  directiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 21
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10.5
  },
  directiveIcon: {
    marginRight: 10.5
  },
  itemIcon: {
    marginLeft: 6,
    marginRight: 20
  },
  countIndicator: {
    fontSize: 18,
    fontWeight: "300",
    color: '#46B29D',
    flex: 1
  }
});

class DirectiveList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
  }

  renderDirective = (directive) => {
    let outcomeName = directive.learningObjectiveId !== '' ?
      ModuleStore.getOutcome(directive.learningObjectiveId).displayName.text :
      'No learning outcome assigned yet';
    return (
      <View key={directive.id} style={styles.directiveContainer}>
        <Image style={styles.directiveIcon} source={require('../../../assets/directive.png')} />
        <Text style={styles.cellTitle}>{outcomeName}</Text>
      </View>
    )
  }

  renderItem = (item, idx) => {
    return (
      <View key={item.id} style={styles.itemContainer}>
        <Image style={styles.itemIcon} source={require('../../../assets/target-question--correct.png')} />
        <Text key={idx} style={styles.cellSubTitle}>Item name goes here item.question.text.text</Text>
      </View>
    )
  }

  renderRow = (directive) => {
    let minimumRequired = directive.minimumProficiency !== '' ?
                          directive.minimumProficiency :
                          0,
      directiveItems = getItemsByDirective(this.props.missionItems, directive);

    return (
      <TouchableHighlight style={{marginBottom: 21}}
                          key={directive.id}
                          onPress={() => this.props.onSelectDirective(directive)}>
        <View style={styles.cell}>
          <View style={styles.cellInfoWrapper}>
            {this.renderDirective(directive)}

            {_.map(directiveItems, this.renderItem)}

          </View>

          {/*hook into this.requiredNumberByDirectiveId and this.props.itemsByDirectiveId.length.
            feel free to rename and / or make a selector out of it
            */}
          <Text style={styles.countIndicator}>{minimumRequired} of {directiveItems.length}</Text>

        </View>
      </TouchableHighlight>
    )
  }

  render() {
    if (this.props.directives.length === 0) {
      return <View />
    } else {
      return (
        <ListView style={[styles.listView, this.props.style]}
                dataSource={this.state.ds.cloneWithRows(this.props.directives)}
                renderRow={this.renderRow}>
        </ListView>
      )
    }
  }


}

module.exports = DirectiveList
