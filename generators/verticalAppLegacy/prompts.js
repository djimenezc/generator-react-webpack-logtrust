'use strict';
const utils = require('../../utils/all');

module.exports = [
  {
    type: 'input',
    name: 'appName',
    message: 'Please choose your application name',
    default: utils.yeoman.getAppName()
  },
  {
    type: 'list',
    name: 'style',
    message: 'Which type of vertical app do you want to build?',
    choices: utils.config.getChoices('verticalAppTypes'),
    default: utils.config.getDefaultChoice('verticalAppTypes')
  },
  // {
  //   type: 'confirm',
  //   name: 'postcss',
  //   message: 'Enable postcss?',
  //   default: false
  // }
];
