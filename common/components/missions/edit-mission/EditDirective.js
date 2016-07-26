
'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated, Easing,
  Dimensions,
  ListView, ScrollView,
  Text, Image, View, TextInput,
  StyleSheet,
  TouchableHighlight, TouchableOpacity,
  } from 'react-native';

var _ = require('lodash');

let {width, height} = Dimensions.get('window');

let styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -300,
    left: 0,
    right: 0,
    width: width,
    height: height,
    paddingTop: 84,
    backgroundColor: '#96CEB4',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: 31,
    left: 21
  },
  searchWrapper: {
    flexDirection: 'row',
    marginBottom: 42
  },
  searchInput: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10.5,
    width: 300,
    justifyContent: 'center',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 21
  },
  filterText: {
    color: '#eee',
  },
  filterButton: {
    padding: 10.5,
    borderWidth: 2,
    borderRadius: 3,
    borderColor: '#eee',
    marginLeft: 10.5,
    marginRight: 10.5
  },
  filterButtonText: {
    color: '#eee'
  },
  searchResultsList: {

  },
  kControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addKButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addKButtonText: {
    color: '#96CEB4',
    fontSize: 16,
    fontWeight: "700"
  },
  minusKButton: {
    marginRight: 10.5
  }
});

class EditDirective extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fadeInAnimation: new Animated.Value(0),
      moveUpAnimation: new Animated.Value(0),
      searchResults: [],
      searchResultsDS: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
  }

  componentDidMount() {
    console.log('EditDirective did mount');

    Animated.parallel([
      Animated.timing(this.state.fadeInAnimation, {
        toValue: 1,
        duration: 600
      }),
      Animated.timing(this.state.moveUpAnimation, {
        toValue: 0,
        duration: 600
      })
    ])
    .start();
  }

  renderRow() {
    return (
      <TouchableOpacity>

      </TouchableOpacity>
    )
  }

  render() {
    let directiveName = this.props.directive ? this.props.directive.displayName : 'The selected outcome name';

    return (
      <Animated.View style={[styles.container, {opacity: this.state.fadeInAnimation, top: this.state.moveUpAnimation}]}>
        <TouchableOpacity onPress={this.props.onClose} style={styles.closeButton}>
          <Image source={require('../../../assets/cancel--light.png')}/>
        </TouchableOpacity>

          <View style={styles.searchWrapper}>
            <Image source={require('../../../assets/search--light.png')}/>
            <TextInput style={styles.searchInput}
                      value={directiveName}
                      defaultValue="My outcome value passed down"
                      onChangeText={_.noop}/>
          </View>

          <View style={styles.filters}>
            <Text style={styles.filterText}>Filter by</Text>
              {_.map(this.props.modules, (module, idx) => {
                console.log(module);
                return (
                  <TouchableOpacity onPress={() => this._onToggleFilter(module)} style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>{module.displayName.text}</Text>
                  </TouchableOpacity>
                )
              })}
          </View>

          {/*<ListView style={[styles.searchResultsList]}
                  dataSource={this.state.searchResultsDS.cloneWithRows(this.state.searchResults)}
                  renderRow={this.renderRow}>
          </ListView>*/}

          <View style={styles.kControl}>
            <TouchableHighlight style={styles.minusKButton} onPress={this.handleMinusK}>
              <Text>-</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.addKButton} onPress={this.handleAddK}>
              <Text style={styles.addKButtonText}>{this.props.mission.k}</Text>
            </TouchableHighlight>
          </View>


      </Animated.View>
    )
  }

  handleMinusK() {
    this.setState({
      k: this.props.mission.k - 1
    })
  }

  handleAddK() {
    this.setState({
      k: this.props.mission.k + 1
    });
  }

  _onToggleFilter(module) {
    let newSearchResults = [];

    // apply filter to select outcomes that belong in this module
    this.setState({
      selectedFilters: [],
      searchResults: newSearchResults
    })
  }
}

module.exports = EditDirective
