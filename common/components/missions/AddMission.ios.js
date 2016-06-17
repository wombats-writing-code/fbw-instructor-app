// AddMission.ios.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ActivityIndicatorIOS,
  Animated,
  DatePickerIOS,
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

var AssessmentConstants = require('../../constants/Assessment');

var ActionTypes = AssessmentConstants.ActionTypes;
var AssessmentStore = require('../../stores/Assessment');
var DateConvert = require('../../../utilities/dateUtil/ConvertDateToDictionary');
var Dispatcher = require('../../dispatchers/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;

var styles = StyleSheet.create({
  actions: {
    flex: 1,
    flexDirection: 'row'
  },
  addItemText: {
    padding: 5,
    textAlign: 'center'
  },
  addItemWrapper: {
    backgroundColor: '#BBEDBB',
    borderColor: '#A9D6A9',
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 5
  },
  buttonText: {
    color: '#444',
    fontSize: 10
  },
  cancelButton: {
  },
  container: {
    flex: 3,
    padding: 5
  },
  createButton: {
  },
  createButtonWrapper: {
    position: 'absolute',
    right: 0
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5
  },
  itemLabel: {
    fontSize: 10
  },
  modalBackdrop: {
    backgroundColor: 'gray',
    opacity: 0.5
  },
  noItemsText: {
    padding: 5,
    textAlign: 'center'
  },
  noItemsWarning: {
    backgroundColor: '#ff9c9c',
    borderColor: '#ff9c9c',
    borderRadius: 5,
    borderWidth: 1
  },
  roundedButton: {
    borderColor: 'white',
    borderRadius: 3,
    borderWidth: 1,
    margin: 5,
    padding: 3
  },
  rowInput: {
    flex: 2
  },
  rowLabel: {
    flex: 1
  },
  separator: {
    borderColor: '#DBDBDB',
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5
  },
  textInput: {
    borderColor: 'gray',
    borderRadius: 3,
    borderWidth: 1,
    height: 40,
    padding: 5
  },
  typePicker: {
  },
  typeWrapper: {
  }
});


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
      bankId: this.props.bankId,
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
  render() {
    var currentItems = this.state.items.length > 0 ?
                       ( <ListView dataSource={this.state.items}
                                   renderRow={this.renderItemRow}>
                         </ListView> ) :
                       ( <View style={styles.noItemsWarning}>
                           <Text style={[styles.itemLabel, styles.noItemsText]}>No questions</Text>
                         </View> ),
      cancelButtonStyle = [styles.cancelButton, styles.roundedButton];

    if (!this.props.sidebarOpen) {
      cancelButtonStyle.push({ left: 20 });
    }

    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>

          <View style={styles.actions}>
            <TouchableHighlight onPress={() => this.props.closeAdd()}>
              <View style={cancelButtonStyle}>
                <Text style={styles.buttonText}>Cancel</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.createAssessment()}
                                style={styles.createButtonWrapper}>
              <View style={[styles.createButton, styles.roundedButton]}>
                <Text style={styles.buttonText}>Create</Text>
              </View>
            </TouchableHighlight>
            
          </View>
          <ScrollView onScroll={(event) => {console.log('scroll!')}}
                      style={ {height: this.state.height - 50 } }>
            <View style={styles.inputRow}>
              <View style={styles.rowLabel}>
                <Text style={styles.inputLabel}>In-class</Text>
              </View>
              <View style={[styles.rowInput, styles.typeWrapper]}>
                <Switch onValueChange={(value) => this.setState({ inClass: value })}
                        value={this.state.inClass} />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.rowLabel}>
                <Text style={styles.inputLabel}>Display Name</Text>
              </View>
              <View style={styles.rowInput}>
                <TextInput autoFocus={true}
                           maxLength={255}
                           onChangeText={(text) => this.setState({missionDisplayName: text})}
                           placeholder="A label for the mission"
                           style={styles.textInput}
                           value={this.state.missionDisplayName} />
              </View>
            </View>
            <View>
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
}

module.exports = AddMission;
