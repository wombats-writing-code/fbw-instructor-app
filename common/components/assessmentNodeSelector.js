'use strict';

import React, {
  Text,
  ListView,
  ScrollView,
  View,
  ActivityIndicatorIOS,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

var _ = require('lodash');

var AssessmentServiceStore = require('../stores/assessment');

var styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  container: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowWrapper: {
    padding: 10
  }
});

var AssessmentNodeSelector = React.createClass({
    getInitialState: function () {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            nodes: ds.cloneWithRows([]),
            isLoading: true,
            loadingMessage: 'Loading assessment banks...'
        };
    },
    componentWillMount: function () {
        var _this = this;
        AssessmentServiceStore.addChangeListener(function (nodes) {
            _this.setNodes(nodes);
        });
    },
    componentDidMount: function () {
        AssessmentServiceStore.getNodeChildren();
    },
    getBankAssessments: function (node) {
        this.props.toRoute({
            name: node.displayName.text,
            component: AssessmentNodeSelector,
            data: node
        });
    },
    setNodes: function (nodes) {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.setState({nodes: ds.cloneWithRows(nodes)});
        this.setState({isLoading: false});
    },
    renderRow: function (rowData, sectionId, rowId) {
        return (
            <TouchableHighlight onPress={() => this.getBankAssessments(rowData)}>
                <View>
                    <View style={styles.rowWrapper}>
                        <Text
                            style={styles.title}
                            numberOfLines={1}
                        >
                            {rowData.displayName.text}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
            );
    },
    render: function () {
        var spinner = this.state.isLoading ?
                      ( <ActivityIndicatorIOS
                            hidden='true'
                            size='large'/> ) :
                      ( <View />);
        return (
            <ScrollView style={styles.container}>
                <ListView
                        dataSource={this.state.nodes}
                        renderRow={this.renderRow}>
                </ListView>
                {spinner}
            </ScrollView>
        );
    }
});

module.exports = AssessmentNodeSelector;