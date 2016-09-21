
import {
  StyleSheet,
} from 'react-native';

module.exports = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -300,
    left: 0,
    right: 0,
    paddingTop: 105,
    paddingLeft: 42,
    paddingRight: 42,
    backgroundColor: '#96CEB4',
    flexDirection: "column"
  },
  closeButton: {
    position: 'absolute',
    top: 31,
    left: 21
  },
  searchDirectiveWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxHeight: 300
  },
  searchQuestionsWrapper: {
  },
  searchWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
    marginLeft: 10.5,
    width: 300,
    justifyContent: 'center',
  },
  filters: {
    flex: 1,
    marginLeft: 21,
    marginRight: 21
  },
  filterText: {
    fontWeight: '600',
    color: '#efefef',
    marginBottom: 10.5
  },
  filterButton: {
    width: 200,
    padding: 8,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#eee',
    marginBottom: 8
  },
  filterButtonText: {
    fontSize: 11,
    color: '#eee'
  },
  filterButtonTextSelected: {
    color: '#333'
  },
  filterButtonSelected: {
    backgroundColor: '#fff'
  },

  searchResults: {
    flex: 3
  },
  searchResult: {
    flexDirection: 'row',
    marginBottom: 10.5
  },
  searchResultText: {
    flex: 1,
    color: '#fff',
    fontStyle: 'italic',
    flexWrap: 'wrap'
  },
  kControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25
  },
  kControlText: {
    color: '#eee',
    marginRight: 21
  },
  addKButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addKButtonText: {
    color: '#96CEB4',
    fontSize: 16,
    fontWeight: "700"
  },
  minusKButton: {
    marginRight: 10.5
  },
  questionText: {
    flex: 1,
    color: '#fff',
    flexWrap: 'wrap'
  },
  questionIcon: {
    marginRight: 20
  },
  questionRow: {
    flex: 1,
    flexDirection: 'row'
  }
});
