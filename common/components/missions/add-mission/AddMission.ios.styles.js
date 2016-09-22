
import {
  StyleSheet,
  } from 'react-native';

module.exports = StyleSheet.create({
  container: {
    justifyContent: 'space-between'
  },
  missionNameInput: {
    backgroundColor: '#eee',
    height: 45,
    paddingLeft: 10.5,
    marginBottom: 21
  },
  navBar: {
    paddingTop: 31.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 21
  },
  button: {
    borderColor: 'white',
    borderRadius: 3,
    borderWidth: 1,
    color: '#444'
  },
  selectMissionType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18
  },
  selectMissionTypeHeader: {
    flex: 4
  },
  missionTypeButtons: {
    flex: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  missionTypeButton: {
    marginRight: 80
  },
  missionTypeIcon: {
    width: 40,
  },
  selectedMissionType: {
    opacity: 1
  },
  unselectedMissionType: {
    opacity: 0.45
  },
  activeIcon: {
    opacity: 1
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
