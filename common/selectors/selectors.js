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
    return items.questions;
  } else {
    return [];
  }
}
