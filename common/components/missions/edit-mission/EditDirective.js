
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
  getDirectiveModule,
  getItemsByDirective,
  filterItemsByOutcome
} from '../../../selectors/selectors';

var ModuleStore = require('../../../stores/Module');

let styles = require('./EditDirective.styles');

class EditDirective extends Component {

  constructor(props) {
    super(props);
    let initialSearchModule = getDirectiveModule(props.modules, props.directive);

    this.state = {
      query: '',
      directiveItemIds: _.map(getItemsByDirective(props.missionItems, props.directive), 'id'),
      fadeInAnimation: new Animated.Value(0),
      minimumRequired: props.directive.minimumProficiency !== '' ?
                       props.directive.minimumProficiency :
                       0,
      moveUpAnimation: new Animated.Value(0),
      moduleDS: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      searchResults: typeof initialSearchModule !== "undefined" ? initialSearchModule.childNodes : [],
      searchResultsDS: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      selectedFilters: typeof initialSearchModule !== "undefined" ? [initialSearchModule] : [],
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
      <TouchableOpacity style={styles.searchResult} key={outcome.id}
                        onPress={() => this._onSetDirectiveLO(outcome)}>
        <Text style={styles.searchResultText}>{outcome.displayName.text}</Text>
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

  renderModuleRow = (module) => {
    let buttonStyles = [styles.filterButton];
    let buttonTextStyles = [styles.filterButtonText];
    let directiveModuleId = this.state.selectedFilters.length > 0 ? this.state.selectedFilters[0].id : '';

    if (module.id == directiveModuleId) {
      buttonStyles.push(styles.filterButtonSelected);
      buttonTextStyles.push(styles.filterButtonTextSelected);
    }
    return (
      <TouchableOpacity key={module.id}
                        onPress={() => this._onToggleFilter(module)}
                        style={buttonStyles}>
        <Text style={buttonTextStyles}>{module.displayName.text}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    let directiveId = this.props.directive !== '' ? this.props.directive.id : '',
      directiveName = directiveId !== '' ? ModuleStore.getOutcome(
        this.props.directive.learningObjectiveId).displayName.text : '',
      searchResults = <View />,
      itemsList = <View />,
      items = filterItemsByOutcome(this.props.directive.learningObjectiveId, this.props.allItems);

    let height = Dimensions.get('window').height;

    if (directiveName === '' || directiveName === 'Unknown LO') {
      directiveName = 'Search for directives ...';
    }

    if (items.length > 0) {
      itemsList = (<ListView dataSource={this.state.questionsDS.cloneWithRows(items)}
                renderRow={this.renderQuestionRow}>
      </ListView>);
    }

    if (this.state.searchResults.length > 0) {
      searchResults = (
        <View style={styles.searchResults}>
          <Text style={styles.filterText}>{'Outcomes'.toUpperCase()}</Text>
          <ListView style={[styles.searchResultsList]}
                dataSource={this.state.searchResultsDS.cloneWithRows(this.state.searchResults)}
                renderRow={this.renderOutcomeRow}>
        </ListView>
      </View>)

    }
    return (
      <Animated.View style={[styles.container, {opacity: this.state.fadeInAnimation, top: this.state.moveUpAnimation}]}>
        <TouchableOpacity onPress={this.closeAndSave}
                          style={styles.closeButton}>
          <Image source={require('../../../assets/cancel--light.png')}/>
        </TouchableOpacity>

        <ScrollView>
          <View style={styles.searchDirectiveWrapper}>
            <View style={styles.searchWrapper}>
              <Image source={require('../../../assets/search--light.png')}/>
              <TextInput style={styles.searchInput}
                         defaultValue={directiveName}
                         onChange={this.onChange}/>
            </View>

            <View style={[styles.filters]}>
              <Text style={styles.filterText}>{'Filter by module'.toUpperCase()}</Text>
                {/*the one selected on default should be the module of the current outcome */}

                <ListView
                  dataSource={this.state.moduleDS.cloneWithRows(this.props.modules)}
                  renderRow={this.renderModuleRow}
                />
            </View>

            {searchResults}
          </View>
        </ScrollView>

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

          {itemsList}
        </View>

      </Animated.View>
    )
  }

  onMinusK = () => {
    if (this.state.minimumRequired !== 0) {
      this.setState({
        minimumRequired: Math.max(this.state.minimumRequired - 1, 0)
      }, () => this.props.onChangeRequiredNumber(this.state.minimumRequired));
    }
  }

  onAddK = () => {
    let maximumPossible = getItemsByDirective(this.props.missionItems, this.props.directive).length;
    if (this.state.minimumRequired !== maximumPossible) {
      this.setState({
        minimumRequired: Math.min(this.state.minimumRequired + 1,
          maximumPossible)
      }, () => this.props.onChangeRequiredNumber(this.state.minimumRequired));
    }
  }

  onChange = (event) => {
    // search against outcomes and update search results
    let _this = this;
    this.setState({ query: event.nativeEvent.text.toLowerCase() }, () => {
        _this._updateSearchResults();
      });
  }

  _onSetDirectiveLO = (outcome) => {
    this.props.onSetDirectiveOutcome(outcome);
    this.setState({ searchResults: [] });
  }

  _onToggleFilter = (module) => {
    let _this = this;
    // apply filter to select outcomes that belong in this module
    this.setState({ selectedFilters: [module] }, () => {
      _this._updateSearchResults();
    });
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

  _updateSearchResults = () => {
    let newHaystack = [],
      whereToSearch = this.state.selectedFilters.length > 0 ? this.state.selectedFilters : this.props.modules;

    _.each(whereToSearch, (module) => {
      newHaystack = newHaystack.concat(module.childNodes);
    });

    this.setState({
      searchResults: _.filter(newHaystack, (outcome) => {
        return (outcome.displayName.text.toLowerCase().indexOf(this.state.query) >= 0 ||
                outcome.description.text.toLowerCase().indexOf(this.state.query) >= 0);
      })
    })
  }
}

module.exports = EditDirective
