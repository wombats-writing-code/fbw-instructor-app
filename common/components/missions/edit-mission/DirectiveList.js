
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
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

var ModuleStore = require('../../../stores/Module');

var _lineHeight = 18;
var sidebarBackground = '#f0f0f0';

let styles = StyleSheet.create({
  cell: {
    flex: 1,
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
  },
  directiveRow: {
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: 1,
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 9,
    paddingRight: 9,
    paddingBottom: _lineHeight / 2,
    paddingTop: _lineHeight / 2,
    backgroundColor: sidebarBackground
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
    backgroundColor: '#445577',
    marginBottom: 21
  },
  rowBackButtonText: {
    color: '#fff'
  },
  deleteDirective: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#9a0000',
    justifyContent: 'center',
    width: 60
  },
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
    //console.log('directive item', item);

    return (
      <View key={item.id} style={styles.itemContainer}>
        <Image style={styles.itemIcon} source={require('../../../assets/target-question--correct.png')} />
        <Text key={idx} style={styles.cellSubTitle}>{item.displayName.text}</Text>
      </View>
    )
  }

  renderRow = (directive, sectionId, rowId, rowMap) => {
    let minimumRequired = directive.minimumProficiency !== '' ?
                          directive.minimumProficiency :
                          0,
      directiveItems = getItemsByDirective(this.props.missionItems, directive);

    let directiveRow = (
      <TouchableHighlight style={[styles.directiveRow, {marginBottom: 21}]}
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
    );

    return (<SwipeRow	leftOpenValue={60}
                      rightOpenValue={-60}
                      disableLeftSwipe={true}>
      <View style={styles.rowBack}>
        <TouchableHighlight onPress={() => {
              this._deleteDirective(directive);
              rowMap[`${sectionId}${rowId}`].closeRow();
              }}
            style={styles.deleteDirective}>
          <Text style={styles.rowBackButtonText}>Delete</Text>
        </TouchableHighlight>
      </View>
      {directiveRow}
    </SwipeRow>);
  }

  render() {
    if (this.props.directives.length === 0) {
      return <View />
    } else {
      return (
        <SwipeListView style={[styles.listView, this.props.style]}
                dataSource={this.state.ds.cloneWithRows(this.props.directives)}
                renderRow={this.renderRow}>
        </SwipeListView>
      )
    }
  }

  _deleteDirective = (directive) => {
    console.log('deleting directive');
    this.props.onDeleteDirective(directive.id);
  }


}

module.exports = DirectiveList
