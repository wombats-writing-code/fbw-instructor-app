var _ = require('lodash');

export const filterItemsByOutcome = (outcomeId, items) => {
  return _.filter(items, {learningObjectiveIds: [outcomeId]});
}
