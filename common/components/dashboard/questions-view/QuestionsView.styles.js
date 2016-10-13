
import {
  StyleSheet
} from 'react-native';

module.exports = StyleSheet.create({
  notification: {
    backgroundColor: '#ff9c9c',
    padding: 3
  },
  notificationText: {
    fontSize: 10,
    padding: 5
  },
  progressIcon: {
    marginRight: 3
  },
  questionRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    padding: 5
  },
  questionTextWrapper: {
    flex: 5
  },
  attemptsTextWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },

  numStudentsDidNotAchieve: {
    color: '#E37B40'
  }
});
