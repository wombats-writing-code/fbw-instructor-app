import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
  accordionHeader: {
    flex: 1,
    flexDirection: 'row',
    padding: 9
  },
  accordionHeaderText: {
    flex: 1,
    fontWeight: "700",
    color: '#666'
  },
  accordionHeaderCounter: {
    textAlign: 'right',
    fontWeight: "300",
    color: '#666',
    fontSize: 12
  },
  itemRow: {
    flex: 1,
    flexDirection: 'row',
    padding: 9,
  },
  itemDisplayName: {
    flex: 1,
    flexDirection: 'row',
  },
  includedItem: {
    color: '#355e3b',
    textAlign: 'center'
  },
  itemState: {
    width: 25
  },
});
