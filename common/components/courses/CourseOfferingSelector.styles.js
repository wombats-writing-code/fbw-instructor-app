import {
  StyleSheet,
} from 'react-native';

var _bodyFontSize = 12;
var _captionFontSize = 10;
var _lineHeight = 18;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f0f0f0',
    maxHeight: 100
  },
  addNewMissionButton: {
    flex: 0,
    width: 44,
    height: 44,
    padding: 5
  },
  toggleCaret: {
    padding: 5,
    width: 44,
    color: '#007AFF'
  },

  // list of missions
  courseWrapper: {
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: 1,
  },
  missionWrapperSelected: {
    backgroundColor: '#444'
  },
  courseRow: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: _lineHeight / 2,
    paddingTop: _lineHeight / 2
  },
  rowTitle: {
    fontSize: _bodyFontSize,
    marginBottom: _lineHeight / 2
  },
  rowSubtitle: {
    color: '#aaa',
    fontSize: _captionFontSize
  },

});
