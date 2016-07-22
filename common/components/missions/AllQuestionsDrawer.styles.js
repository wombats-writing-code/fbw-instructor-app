import {
  StyleSheet,
} from 'react-native'

module.exports = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    backgroundColor: '#fbfafd',
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  header: {
    paddingTop: 30,
    padding: 3
  },
  headerText: {
    color: '#444',
    textAlign: 'center',
    marginBottom: 18
  },
  noQuestionsIndicator: {
    backgroundColor: '#ff9c9c',
    padding: 3
  },
  noQuestionsIndicatorText: {
    fontSize: 10,
    padding: 5
  },
});
