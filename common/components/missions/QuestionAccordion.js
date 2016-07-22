// QuestionAccordion.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  Dimensions,
  ListView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  } from 'react-native';

import Accordion from 'react-native-collapsible/Accordion';

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');

var styles = require('./QuestionAccordion.styles');


class QuestionAccordion extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  componentWillUnmount() {
  }
  componentDidMount() {
  }
  componentDidUpdate() {
  }
  onLayout = (event) => {
    // TODO: how to make this height change when device is rotated?
    // This doesn't get called -- why not??? Docs say it should, on mount and on layout change...
    console.log('onLayout called');
    this.setState({ height: Dimensions.get('window').height });
  }
  renderAccordionHeader = (section) => {
    return (
      <View style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>
          {section.displayName}
        </Text>
        <Text style={styles.accordionHeaderCounter}>
          ({section.items.length} questions)
        </Text>
      </View>
      );
  }
  renderAccordionContent = (section) => {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    if (section.items.length > 0) {
      return (
        <ListView
        dataSource={ds.cloneWithRows(section.items)}
        renderRow={this.renderItemRow}>
        </ListView>
        );
    } else {
      return <View />;
    }
  }
  renderItemRow = (rowData, sectionId, rowId) => {
    var itemIncludedIcon = <View />,
      missionItemIds = _.map(this.props.missionItems, 'id');

    if (missionItemIds.indexOf(rowData.id) >= 0) {
      itemIncludedIcon = <View>
        <Icon name="check" style={styles.includedItem} />
      </View>;
    }

    return (
      <View>
        <TouchableHighlight onPress={() => this.toggleItemInAssessment(rowData)}>
          <View style={styles.itemRow}>
            <View style={styles.itemState}>
              {itemIncludedIcon}
            </View>
            <Text numberOfLines={3}
                  style={styles.itemDisplayName}>
              {rowData.displayName.text}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
      );
  }
  toggleItemInAssessment = (item) => {
    var missionItems = this.props.missionItems,
      missionItemIds = _.map(missionItems, 'id'),
      updatedMissionItems = [];

    if (missionItemIds.indexOf(item.id) >= 0) {
      // remove the item
      _.each(missionItems, function (missionItem) {
        if (item.id != missionItem.id) {
          updatedMissionItems.push(missionItem);
        }
      });
    } else {
      updatedMissionItems = missionItems;
      updatedMissionItems.push(item);
    }

    this.props.updateItemsInMission(updatedMissionItems);
  }
  render() {
    var itemsArray = this._formatSections();
    return (
      <Accordion renderContent={this.renderAccordionContent}
                 renderHeader={this.renderAccordionHeader}
                 sections={itemsArray} />
    );
  }
  _formatSections() {
    return _.map(this.props.items, function (moduleData, moduleId) {
      return moduleData;
    });
  }
}

module.exports = QuestionAccordion;
