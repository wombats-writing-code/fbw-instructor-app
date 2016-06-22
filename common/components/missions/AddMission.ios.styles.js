
import {
  StyleSheet,
  } from 'react-native';

module.exports = StyleSheet.create({
  container: {
    flex: 3,
    padding: 9,
    paddingLeft: 300,
    justifyContent: 'space-between'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 400,
    marginBottom: 18
  },
  button: {
    borderColor: 'white',
    borderRadius: 3,
    borderWidth: 1,
    color: '#444'
  },
  missionTypeSelector: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: 400,
    marginBottom: 18
  },
  missionTypeSelectorIcon: {
    width: 40,
    opacity: 0.5
  },
  activeIcon: {
    opacity: 1
  },
  missionNameInput: {
    backgroundColor: '#eeddff',
    height: 45,
    width: 400,
    padding: 9,
    marginBottom: 18
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
  },
  cancelButton: {
  },
  createButton: {
  },
  createButtonWrapper: {
    position: 'absolute',
    right: 0
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
  separator: {
    borderColor: '#DBDBDB',
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5
  },
  typePicker: {
  },
  typeWrapper: {
  }
});
