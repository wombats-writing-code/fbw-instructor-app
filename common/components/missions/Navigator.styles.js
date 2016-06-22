
import {
  StyleSheet
} from 'react-native';

module.exports = StyleSheet.create({

  navBar: {
    alignItems: 'center',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    paddingBottom: 9,
    paddingTop: 30,
    marginBottom: 18,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  title: {
    // fontSize: 10,
    fontWeight: "700",
    textAlign: 'center'
  },
  subTitle: {
    // fontSize: 8,
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
