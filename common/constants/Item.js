// assessment item constants

var keyMirror = require('keymirror');

module.exports = {
  ActionTypes: keyMirror({
    CHANGE_EVENT: null,
  }),
  BankMap: {
    //'assessment.Bank%3A57279fc9e7dde086c7fe2102%40bazzim.MIT.EDU': 'assessment.Bank%3A57279fbfe7dde08818af5661%40bazzim.MIT.EDU',  // fake accounting term -> CAD QBank Content Library
    'assessment.Bank%3A57279fc9e7dde086c7fe2102%40bazzim.MIT.EDU': 'assessment.Bank%3A57279fb9e7dde086d01b93ef%40bazzim.MIT.EDU',  // fake accounting term -> MAT QBank Content Library
    'assessment.Bank%3A57279fbce7dde086c7fe20ff%40bazzim.MIT.EDU': 'mc3-objectivebank%3A2815%40MIT-OEIT',  // ACC 1
    'assessment.Bank%3A57279fb9e7dde086d01b93ef%40bazzim.MIT.EDU': 'mc3-objectivebank%3A2815%40MIT-OEIT',  // MAT 1
  },
  GenusTypes: {
  }
};