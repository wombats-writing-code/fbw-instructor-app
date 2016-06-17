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
var Icon = require('react-native-vector-icons/FontAwesome');

var AccountStore = require('../stores/Account');

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
  },
  footer: {
    alignSelf: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: 'green',
    borderRadius: 10,
    width: 300
  },
  addButton: {
  },
  buttonText: {
    textAlign: 'center'
  }
});


var AccountsList = React.createClass({
    getInitialState: function () {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            accounts: ds.cloneWithRows([]),
            isLoading: true,
            loadingMessage: 'Loading your accounts...'
        };
    },
    componentWillMount: function () {
        var _this = this;
        AccountStore.addChangeListener(function (accounts) {
            _this.setAccounts(accounts);
        });
    },
    componentDidMount: function () {
        AccountStore.getUserAccounts();
    },
    addAccount: function () {

    },
    getAccountDetails: function (accountData) {

    },
    setAccounts: function (accounts) {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.setState({accounts: ds.cloneWithRows(accounts)});
        this.setState({isLoading: false});
    },
    renderRow: function (rowData, sectionId, rowId) {
        return (
            <TouchableHighlight onPress={() => this.getAccountDetails(rowData)}>
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
            <View style={styles.container}>
                <ScrollView>
                    <ListView
                            dataSource={this.state.accounts}
                            renderRow={this.renderRow}>
                    </ListView>
                </ScrollView>
                {spinner}
                <View style={styles.footer}>
                    <TouchableHighlight style={styles.addButton} onPress={() => this.addAccount()}>
                        <View>
                            <Text style={styles.buttonText}>
                                <Icon name="plus" /> Add School Account
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
});

module.exports = AccountsList;