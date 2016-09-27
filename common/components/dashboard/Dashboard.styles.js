
import {
  StyleSheet
} from 'react-native';

module.exports = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 3
  },
  dashboardNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 18
  },
  dashboardNavButton: {
    padding: 9,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  selectedButton: {
    borderColor: '#888'
  },
  buttonText: {
    color: '#666',
    fontWeight: "500",
    letterSpacing: 1
  },
  scrollContainer: {
    height: 650
  },
  pickNumberPromptWrapper: {
    flexDirection: 'row',
  },
  numberWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 5,
    marginRight: 5
  },
  number: {
    fontWeight: "600",
    color: "#FF6F69"
  },
  ordinal: {
    fontWeight: "500",
    color: "#FF6F69",
    fontSize: 8
  }
});
