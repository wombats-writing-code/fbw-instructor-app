// assessment constants

var keyMirror = require('keymirror');

module.exports = {
    ActionTypes: keyMirror({
        CHANGE_EVENT: null,
        CREATE_ASSESSMENT: null,
        DELETE_ASSESSMENT: null,
        UPDATE_ASSESSMENT: null,
        CREATE_ASSESSMENT_OFFERED: null,
        DELETE_ASSESSMENT_OFFERED: null,
        UPDATE_ASSESSMENT_OFFERED: null,
        CREATE_ASSESSMENT_TAKEN: null,
        DELETE_ASSESSMENT_TAKEN: null,
        UPDATE_ASSESSMENT_TAKEN: null
    }),
    GenusTypes: {
      HOMEWORK: 'assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU',
      IN_CLASS: 'assessment-genus%3Afbw-in-class-mission%40ODL.MIT.EDU',
      ROOT: "assessment-bank-genus%3Afbw-root%40ODL.MIT.EDU",
      SUBJECT: "assessment-bank-genus%3Afbw-subject%40ODL.MIT.EDU",
      TERM: "assessment-bank-genus%3Afbw-term%40ODL.MIT.EDU"
    }
};