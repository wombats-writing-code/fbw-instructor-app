// account constants

import Store from 'react-native-store';

var keyMirror = require('keymirror');

module.exports = {
    ActionTypes: keyMirror({
        CHANGE_EVENT: null,
        CREATE_BANK: null,
        DELETE_BANK: null,
        UPDATE_BANK: null,
        CREATE_ITEM: null,
        DELETE_ITEM: null,
        UPDATE_ITEM: null,
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
    DB: {
        'account': Store.model('account')
    }
};