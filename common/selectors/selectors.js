var _ = require('lodash');

export const filterItemsByOutcome = (outcomeId, items) => {
  return _.filter(items, {learningObjectiveIds: [outcomeId]});
}

export const getItemsByDirective = (missionItems, directive) => {
  // assumes missionItems is from the AssessmentItem store, where
  // the data is organized by:
  // [{id: partId, (will not match the directiveId because directive is a section, not the part)
  //   learningObjectiveId: '',  (match on this to directive.learningObjectiveId)
  //   questions: []}]
  // assumes that learningObjectiveIds are not duplicated across multiple
  //    directives ...
  let items = _.find(missionItems, {learningObjectiveId: directive.learningObjectiveId});
  if (typeof items !== "undefined") {
    if (items.questions) {
      return items.questions;
    } else {
      return [];
    }
  } else {
    return [];
  }
}

export const getDirectiveModule = (modules, directive) => {
  return _.find(modules, (module) => {
    let childIndices = _.map(module.childNodes, 'id');
    return childIndices.indexOf(directive.learningObjectiveId) >= 0;
  });
}
