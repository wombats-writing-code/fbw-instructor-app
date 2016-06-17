// BankSelector.js

'use strict';

import React, {
    Component,
} from 'react';
import {
  Text,
  ListView,
  ScrollView,
  View,
  ActivityIndicatorIOS,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

var AssessmentConstants = require('../../constants/Assessment');
var Dispatcher = require('../../dispatchers/User');
var Icon = require('react-native-vector-icons/FontAwesome');
var qbankFetch = require('../../../utilities/fetch/fetch');
var UserConstants = require('../../constants/User');
var _ = require('lodash');


var ActionTypes = UserConstants.ActionTypes;
var GenusTypes = AssessmentConstants.GenusTypes;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  rowWrapper: {
    padding: 10
  },
  title: {
    fontSize: 20,
    color: '#656565'
  }
});


class BankSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            banks: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            loading: true
        };
    }
    componentDidMount() {
      console.log('mounted bank selectdor');
      this.getBanks();
    }
    getAssessments(bankData) {
        // store the bank selected
        Dispatcher.dispatch({
            type: ActionTypes.BANK_SELECTED,
            content: {
                bankId: bankData.id
            }
        });

        // navigate to MissionsManager
        this.props.navigator.push({
          id: 'missions',
          title: 'Missions',
          index: 1
        });
    }
    getBanks() {
        var _this = this,
            params = {
                path: 'assessment/banks?genus_type_id=' + GenusTypes.SUBJECT + '&page=all'
            },
            numberTotalFetches = 0,
            _banks = [];

        qbankFetch(params, function (data) {
            var subjects = data.data.results;

            numberTotalFetches = numberTotalFetches + subjects.length;
            _.each(subjects, function (subject) {
                var subjectParams = {
                    path: 'assessment/hierarchies/nodes/' + subject.id + '/children?descendants=1&page=all'
                };

                qbankFetch(subjectParams, function (subjectData) {
                    // match subject + terms here
                    var terms = subjectData.data.results;

                    numberTotalFetches = numberTotalFetches + terms.length;

                    _.each(terms, function (term) {
                        var displayName = subject.displayName.text + ', ' + term.displayName.text;

                        _banks.push({
                            id: term.id,
                            displayName: displayName
                        });

                        numberTotalFetches --;

                        if (numberTotalFetches === 0) {
                            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
                              sortedBanks = _.sortBy(_banks, 'displayName');
                            _this.setState({
                                banks: ds.cloneWithRows(sortedBanks),
                                loading: false
                            });
                        }
                    });
                });

                numberTotalFetches --;
            });
        });
    }
    renderRow(rowData, sectionId, rowId) {
        return (
            <TouchableHighlight onPress={() => this.getAssessments(rowData)}>
                <View>
                    <View style={styles.rowWrapper}>
                        <Text
                            style={styles.title}
                            numberOfLines={1}
                        >
                            {rowData.displayName}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
    render() {
        if (this.state.loading) {
            return this.renderLoadingView();
        }

        return (
            <View style={styles.container}>
                <ScrollView>
                    <ListView
                            dataSource={this.state.banks}
                            renderRow={this.renderRow.bind(this)}>
                    </ListView>
                </ScrollView>
            </View>
        );
    }
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <ActivityIndicatorIOS
                                hidden='true'
                                size='large'/>
                <Text>
                    Loading your subjects ...
                </Text>
            </View>
        );
    }
}

module.exports = BankSelector;