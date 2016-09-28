var _ = require('lodash');
let moment = require('moment');
require('moment-timezone');

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

export const localDateTime = (utcDateObject) => {
  // do this weird stuff instead of using moment.utc() because
  // that still seems to generate stuff of an hour and not account
  // for DST in GMT...
  let localTime = _.assign({}, utcDateObject),
    timezone = moment.tz.guess();

  localTime.month = localTime.month - 1;  // because JavaScript is 0-index, not like Python

  if (localTime.month < 0) {
    localTime.month = localTime.month + 12;
  }

  if (moment.tz(localTime, "Europe/London").isDST()) {
    localTime.hour = localTime.hour + 1;
    // let moment.js handle numbers > 23 by also changing the day internally
  }

  return moment.tz(localTime, "Europe/London").clone().tz(timezone);
}
