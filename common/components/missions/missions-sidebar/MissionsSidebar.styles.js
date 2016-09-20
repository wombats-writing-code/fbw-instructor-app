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
    justifyContent: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingTop: 60,
    // alignItems: 'stretch'
  },
  loadingMissions: {
    paddingTop: 30,
  },
  sectionHeader: {
    paddingLeft: 8,
    fontSize: _bodyFontSize,
    letterSpacing: .5,
    fontWeight: "600",
    color: '#333',
    marginBottom: _lineHeight / 2,
    marginTop: _lineHeight /2
  },
  sidebarFooter: {
    height: 10
  },
  logoutWrapper: {
    position: 'absolute',
    left: 15,
    top: 30
  },
  logoutButton: {

  },
  logoutText: {
    color: '#0000ff'
  }
});
