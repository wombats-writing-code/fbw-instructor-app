// ConvertDateToDictionary
// To make this compatible with QBank format for deadline and startTime
'use strict';

var ConvertDateToDictionary = function (date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes()
  };
};

module.exports = ConvertDateToDictionary;