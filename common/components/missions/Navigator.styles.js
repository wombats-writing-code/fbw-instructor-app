
import {
  StyleSheet
} from 'react-native';

module.exports = StyleSheet.create({

  navBar: {
    alignItems: 'center',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    paddingBottom: 9,
    paddingTop: 9,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  navIcon: {
    width: 44,
    paddingLeft: 5,
    paddingRight: 5,
    flex: 0
  },
  title: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 8,
    textAlign: 'center'
  },
  titleWithSubtitle: {
    flex: 1,
    flexDirection: 'column'
  },
  titleWrapper: {
    flex: 3,
  },
});
