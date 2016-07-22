// AddMission.ios.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  DatePickerIOS,
  Dimensions,
  ListView,
  ScrollView,
  StyleSheet,
  Switch,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

var AssessmentConstants = require('../../constants/Assessment');

var ActionTypes = AssessmentConstants.ActionTypes;
var AssessmentStore = require('../../stores/Assessment');

var credentials = require('../../constants/credentials');
var DateConvert = require('fbw-utils')(credentials).ConvertDateToDictionary;
var Dispatcher = require('../../dispatchers/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;

var styles = require('./AddMission.ios.styles');


class AddMission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      inClass: false,
      items: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      missionDeadline: new Date(),
      missionDisplayName: '',
      missionStartDate: new Date(),
      opacity: new Animated.Value(0),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
    };
  }
  componentWillUnmount() {
    Animated.timing(this.state.opacity, {
      toValue: 0
    }).start();
  }
  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1
    }).start();

    this.setState({ height: Dimensions.get('window').height });
  }
  componentDidUpdate() {
    // issue with styling DatePickerIOS:
    // https://github.com/facebook/react-native/issues/1587
//    if (this.refs.startDateDatepicker && this.refs.deadlineDatePicker) {
//      this.refs.startDateDatepicker.refs.datepicker.setNativeProps({width: Window.width - 500});
//      this.refs.deadlineDatePicker.refs.datepicker.setNativeProps({width: Window.width - 100});
//    }
  }
  createAssessment() {

    var data = {
      deadline: DateConvert(this.state.missionDeadline),
      description: 'A Fly-by-Wire mission',
      displayName: String(this.state.missionDisplayName),
      startTime: DateConvert(this.state.missionStartDate)
    };

    if (this.state.inClass) {
      data.genusTypeId = GenusTypes.IN_CLASS;
    } else {
      data.genusTypeId = GenusTypes.HOMEWORK;
    }

    Dispatcher.dispatch({
        type: ActionTypes.CREATE_ASSESSMENT,
        content: data
    });

    this.props.closeAdd();
  }
  onLayout = (event) => {
    // TODO: how to make this height change when device is rotated?
    // This doesn't get called -- why not??? Docs say it should, on mount and on layout change...
    console.log('onLayout called');
    this.setState({ height: Dimensions.get('window').height });
  }
  renderItemRow = (rowData, sectionId, rowId) => {

  }
  render = () => {
    var currentItems = this.state.items.length > 0 ?
                       ( <ListView dataSource={this.state.items}
                                   renderRow={this.renderItemRow}>
                         </ListView> ) :
                       ( <View style={styles.noItemsWarning}>
                           <Text style={[styles.itemLabel, styles.noItemsText]}>No questions</Text>
                         </View> )

    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>

          <View style={styles.buttons}>
            <TouchableHighlight onPress={() => this.props.closeAdd()}>
                <Text style={styles.button}>Cancel</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.createAssessment()}
                                style={styles.createButtonWrapper}>
                <Text style={styles.button}>Create</Text>
            </TouchableHighlight>
          </View>

          <ScrollView onScroll={(event) => {console.log('scroll!')}}
                      style={ {height: this.state.height - 50 } }>

              <View style={styles.missionTypeSelector}>
                <TouchableHighlight onPress={() => this._onSelectMissionType('homework')}>
                  <Image
                    source={require('./assets/mission-selector-icon--homework.png')}
                    style={[styles.missionTypeSelectorIcon, !this.state.inClass && styles.active]}
                  />
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this._onSelectMissionType('in-class')}>
                  <Image
                    source={require('./assets/mission-selector-icon--in-class.png')}
                    style={[styles.missionTypeSelectorIcon, this.state.inClass && styles.active]}
                  />
                </TouchableHighlight>
              </View>

              <TextInput maxLength={255}
                         onChangeText={(text) => this.setState({missionDisplayName: text})}
                         placeholder="A name for this mission"
                         style={styles.missionNameInput}
                         value={this.state.missionDisplayName} />

           <View styles={styles.startDateWrapper}>
              <Text style={styles.inputLabel}>Start Date</Text>
              <DatePickerIOS date={this.state.missionStartDate}
                             minuteInterval={30}
                             mode="datetime"
                             onDateChange={(date) => this.setState({missionStartDate: new Date(date)})}
                             ref="startDateDatepicker"
                             timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}/>
            </View>

            <View>
              <Text style={styles.inputLabel}>Deadline</Text>
              <DatePickerIOS date={this.state.missionDeadline}
                             minimumDate={this.state.missionStartDate}
                             minuteInterval={30}
                             mode="datetime"
                             onDateChange={(date) => this.setState({missionDeadline: new Date(date)})}
                             ref="deadlineDatepicker"
                             timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}/>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }

  _onSelectMissionType = (missionTypeString) => {

    let value = (missionTypeString === 'in-class');
    console.log('selected value', value)
    this.setState({ inClass: value });
  }
}


module.exports = AddMission;
