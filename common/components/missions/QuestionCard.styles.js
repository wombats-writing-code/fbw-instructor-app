
import {
  StyleSheet,
  } from 'react-native';

  module.exports = StyleSheet.create({
    questionCardWrapper: {
      marginBottom: 9,
      marginTop: 9,
      // marginRight: 5,
      // marginLeft: 4
    },
    questionCard: {
      backgroundColor: '#ffffff',
      flex: 1,
      flexDirection: 'row',
    },
    questionCardActive: {
      backgroundColor: '#ffffff',
      shadowColor: "#000000",
      shadowOpacity: 0.3,
      shadowRadius: 3,
      shadowOffset: {
        height: 0,
        width: 0
      }
    },
    itemNumberSection: {
      backgroundColor: '#fff',
      color: '#999',
      width: 50,
      fontSize: 27,
      padding: 9,
      textAlign: 'center'
    },
    LOTextSection: {
      backgroundColor: '#eeeeee',
      width: 170,
      padding: 9,
      alignItems: 'center',
    },
    questionText: {
      height: 100
    },
    choiceIcon: {
      marginTop: 10
    },
    choiceIconWrapper: {
      height: 50,
      width: 35
    },
    choiceRow: {
      flex: 1,
      flexDirection: 'row'
    },
    choiceText: {
      flex: 1,
      height: 50
    },
    choicesContent: {
      borderTopColor: 'green',
      borderTopWidth: 1
    },
    questionAction: {
      flex: 1
    },
    questionContent: {
      flex: 1
    },
    questionDisplayNameWrapper: {
      flex: 1,
      flexDirection: 'row'
    },
    rightAnswer: {
      color: '#355e3b',
      textAlign: 'center'
    },
    sectionLabel: {
      padding: 3,
      width: 25
    },
    sectionText: {
      flex: 1,
      padding: 3
    },
    toggleChoicesButton: {
      backgroundColor: 'green',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      opacity: 0.5,
      padding: 5,
      position: 'absolute',
      right: 0,
      top: -20
    },
  });
