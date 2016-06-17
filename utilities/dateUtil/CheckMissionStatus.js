// CheckMissionStatus.js
// To see if a mission is over, pending, or future
'use strict';

var CheckMissionStatus = function (mission) {
  var st = mission.startTime,
    dl = mission.deadline,
    // need to subtract one because when you construct a Date object here,
    // it assumes 0 index....but the native input and server-side use 1 index
    startTime = new Date(st.year, st.month - 1, st.day, st.hour),
    deadline = new Date(dl.year, dl.month - 1, dl.day, dl.hour),
    now = new Date(),
    offset, nowSec;

  // this is not exact, because it essentially treats UTC
  // as belonging to the client timezone...but not sure
  // what is a better way to evaluate, because we can't
  // set timezone in JS Date() objects.
  nowSec = now.getTime();
  offset = now.getTimezoneOffset() * 60000;
  now = new Date(nowSec + offset);

  if (deadline < now) {
    return 'over';
  } else if (startTime <= now && now <= deadline) {
    return 'pending';
  } else {
    return 'future';
  }
};

module.exports = CheckMissionStatus;