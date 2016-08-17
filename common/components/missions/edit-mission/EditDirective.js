
'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated, Easing,
  Dimensions,
  ListView, ScrollView,
  Text, Image, View, TextInput,
  StyleSheet,
  TouchableHighlight, TouchableOpacity,
  } from 'react-native';

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');

import {
  getItemsByDirective,
  filterItemsByOutcome
} from '../../../selectors/selectors';

var ModuleStore = require('../../../stores/Module');

let {width, height} = Dimensions.get('window');

let styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -300,
    left: 0,
    right: 0,
    width: width,
    height: height,
    paddingTop: 105,
    paddingLeft: 42,
    paddingRight: 42,
    backgroundColor: '#96CEB4',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  closeButton: {
    position: 'absolute',
    top: 31,
    left: 21
  },
  searchDirectiveWrapper: {

  },
  searchQuestionsWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchWrapper: {
    flexDirection: 'row',
    marginBottom: 42
  },
  searchInput: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10.5,
    width: 300,
    justifyContent: 'center',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 21
  },
  filterText: {
    color: '#eee',
  },
  filterButton: {
    padding: 10.5,
    borderWidth: 2,
    borderRadius: 3,
    borderColor: '#eee',
    marginLeft: 10.5,
    marginRight: 10.5
  },
  filterButtonSelected: {
    backgroundColor: 'blue'
  },
  filterButtonText: {
    color: '#eee'
  },
  searchResultsList: {

  },
  kControl: {
    flexDirection: 'row',
    alignItems: 'center',
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
  }
});


class EditDirective extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      directiveItemIds: _.map(getItemsByDirective(props.missionItems, props.directive), 'id'),
      fadeInAnimation: new Animated.Value(0),
      minimumRequired: props.directive.minimumProficiency !== '' ?
                       props.directive.minimumProficiency :
                       0,
      moveUpAnimation: new Animated.Value(0),
      outcomes: ModuleStore.getOutcomes(),
      searchResults: [],
      searchResultsDS: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      questionsDS: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
  }

  componentDidMount() {
    Animated.parallel([
      Animated.timing(this.state.fadeInAnimation, {
        toValue: 1,
        duration: 600
      }),
      Animated.timing(this.state.moveUpAnimation, {
        toValue: 0,
        duration: 600
      })
    ])
    .start();
  }

  closeAndSave = () => {
    this.props.onClose();
  }

  renderOutcomeRow = (outcome) => {
    return (
      <TouchableOpacity key={outcome.id}
                        onPress={() => this._onSetDirectiveLO(outcome)}>
        <Text>{outcome.displayName.text}</Text>
      </TouchableOpacity>
    )
  }

  renderQuestionRow = (question) => {
    let selectedIcon = <View />;

    if (this.state.directiveItemIds.indexOf(question.id) >= 0) {
      selectedIcon = <Icon name="check" />;
    }
    return (
      <TouchableOpacity key={question.id}
                        onPress={() => this._updateDirectiveItemIds(question.id)}>
        <View>
          {selectedIcon}
          <Text>{question.displayName.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    let directiveId = this.props.directive !== '' ? this.props.directive.id : '',
      directiveName = directiveId !== '' ? ModuleStore.getOutcome(
        this.props.directive.learningObjectiveId).displayName.text : '',
      searchResults = <View />;

    if (directiveName === '' || directiveName === 'Unknown LO') {
      directiveName = 'Search for directives ...';
    }

    if (this.state.searchResults.length > 0) {
      searchResults = (<ListView style={[styles.searchResultsList]}
              dataSource={this.state.searchResultsDS.cloneWithRows(this.state.searchResults)}
              renderRow={this.renderOutcomeRow}>
      </ListView>);
    }
    return (
      <Animated.View style={[styles.container, {opacity: this.state.fadeInAnimation, top: this.state.moveUpAnimation}]}>
        <TouchableOpacity onPress={this.closeAndSave}
                          style={styles.closeButton}>
          <Image source={require('../../../assets/cancel--light.png')}/>
        </TouchableOpacity>

        <View style={styles.searchDirectiveWrapper}>
          <View style={styles.searchWrapper}>
            <Image source={require('../../../assets/search--light.png')}/>
            <TextInput style={styles.searchInput}
                       defaultValue={directiveName}
                       onChange={this.onChange}/>
          </View>

          <View style={styles.filters}>
            <Text style={styles.filterText}>Filter by</Text>
              {/*the one selected on default should be the module of the current outcome */}

              {_.map(this.props.modules, (module, idx) => {
                let buttonStyles = [styles.filterButton],
                  childIndices = _.map(module.childNodes, 'id');
                if (childIndices.indexOf(this.props.directive.learningObjectiveId) >= 0) {
                  buttonStyles.push(styles.filterButtonSelected);
                }
                return (
                  <TouchableOpacity key={module.id}
                                    onPress={() => this._onToggleFilter(module)}
                                    style={buttonStyles}>
                    <Text style={styles.filterButtonText}>{module.displayName.text}</Text>
                  </TouchableOpacity>
                )
              })}
          </View>
          {searchResults}
        </View>

        <View style={styles.searchQuestionsWrapper}>
          <View style={styles.kControl}>
            <Text style={styles.kControlText}>Required</Text>
            <TouchableHighlight style={styles.minusKButton} onPress={this.onMinusK}>
              <Image source={require('../../../assets/minus--light.png')}/>
            </TouchableHighlight>

            <TouchableHighlight style={styles.addKButton} onPress={this.onAddK}>
              <Text style={styles.addKButtonText}>{this.state.minimumRequired}</Text>
            </TouchableHighlight>
          </View>

          <ListView dataSource={this.state.questionsDS.cloneWithRows(
                                filterItemsByOutcome(this.props.directive.learningObjectiveId, this.props.allItems))}
                    renderRow={this.renderQuestionRow}>
          </ListView>
        </View>

      </Animated.View>
    )
  }

  onMinusK = () => {
    this.setState({
      minimumRequired: Math.max(this.state.minimumRequired - 1, 0)
    }, () => this.props.onChangeRequiredNumber(this.state.minimumRequired));
  }

  onAddK = () => {
    let maximumPossible = 9;  // for testing
    // TODO: need to update maximumPossible to reflect the number of questions in
    // the section
    this.setState({
      minimumRequired: Math.min(this.state.minimumRequired + 1,
        maximumPossible)
    }, () => this.props.onChangeRequiredNumber(this.state.minimumRequired));
  }

  onChange = (event) => {
    // search against outcomes and update search results
    let query = event.nativeEvent.text.toLowerCase();
    this.setState({
      query: query,
      searchResults: _.filter(this.state.outcomes, (outcome, outcomeId) => {
        return (outcome.displayName.text.toLowerCase().indexOf(query) >= 0 ||
                outcome.description.text.toLowerCase().indexOf(query) >= 0);
      })
    })
  }

  _onSetDirectiveLO = (outcome) => {
    this.props.onSetDirectiveOutcome(outcome);
    this.setState({ searchResults: [] });
  }

  _onToggleFilter(module) {
    let newSearchResults = [];

    // apply filter to select outcomes that belong in this module
    this.setState({
      selectedFilters: [],
      searchResults: newSearchResults
    })
  }

  _updateDirectiveItemIds = (questionId) => {
    let updatedItemIds = this.state.directiveItemIds,
      _this = this;
    if (this.state.directiveItemIds.indexOf(questionId) < 0) {
      updatedItemIds.push(questionId);
    } else {
      _.remove(updatedItemIds, (id) => {return id == questionId;});
    }
    this.setState({ directiveItemIds: updatedItemIds }, () => {
      _this.props.onUpdateQuestions(_this.state.directiveItemIds);
    });
  }
}

module.exports = EditDirective
