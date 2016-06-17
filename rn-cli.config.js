'use strict';
// from https://github.com/facebook/react-native/issues/5467

const blacklist = require('react-native/packager/blacklist');

var myBlacklist = [
  /InstructorApp\/node_modules\/.+\/node_modules\/fbjs\/.*/
]

module.exports = {
  getBlacklistRE() {
    return blacklist('', myBlacklist);
  },
};