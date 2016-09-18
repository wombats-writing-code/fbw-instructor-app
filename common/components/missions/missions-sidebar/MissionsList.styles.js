import {
  StyleSheet,
} from 'react-native';

var _bodyFontSize = 12;
var _captionFontSize = 10;
var _lineHeight = 18;

var sidebarBackground = '#f0f0f0';

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: sidebarBackground,
  },
  sideBarNav: {
    alignItems: 'center',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 9,
    paddingTop: 30,
    marginBottom: 18
  },

  // list of missions
  missionsList: {
    position: 'relative',
    flex: 1
  },
  missionRow: {
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
    backgroundColor: '#445577'
  },
  rowBackButtonText: {
    color: '#fff'
  },
  deleteMission: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#9a0000',
    justifyContent: 'center',
    width: 60
  },
  missionRowSelected: {
    backgroundColor: '#444'
  },
  missionInformation: {
    flex: 1
  },
  missionTypeIcon: {
    flex: 0,
    width: 30,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginRight: 10
  },
  missionRightIcon: {
    color: '#656565',
    justifyContent: 'center',
  },
  missionTitle: {
    fontSize: _bodyFontSize,
    letterSpacing: .5,
    fontWeight: "600",
    color: '#333',
    marginBottom: _lineHeight / 2
  },
  missionSubtitle: {
    color: '#aaa',
    fontSize: _captionFontSize
  },

  noMissionsText: {
    fontSize: _captionFontSize,
    textAlign: 'center'
  },
  progressIcon: {
    marginRight: 3
  },
  rounded: {
    borderRadius: 3
  },
  sidebarFooter: {
    height: 10
  },

});
