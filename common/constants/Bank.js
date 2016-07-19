// bank constants

var keyMirror = require('keymirror');

module.exports = {
    ActionTypes: keyMirror({
        CHANGE_EVENT: null,
        SET_BANK_ALIAS: null
    }),
    GenusTypes: {
      HOMEWORK: 'assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU',
      IN_CLASS: 'assessment-genus%3Afbw-in-class-mission%40ODL.MIT.EDU',
      ROOT: "assessment-bank-genus%3Afbw-root%40ODL.MIT.EDU",
      DEPARTMENT: "assessment-bank-genus%3Afbw-department%40ODL.MIT.EDU",
      SUBJECT: "assessment-bank-genus%3Afbw-subject%40ODL.MIT.EDU",
      TERM: "assessment-bank-genus%3Afbw-term%40ODL.MIT.EDU"
    },
    SchoolBanks: {
      ACC: 'assessment.Bank%3A57279fc2e7dde08807231e61%40bazzim.MIT.EDU',
      QCC: 'assessment.Bank%3A57279fcee7dde08832f93420%40bazzim.MIT.EDU'
    }
};
