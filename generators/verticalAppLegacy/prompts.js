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
    name: 'verticalAppType',
    message: 'Which type of vertical app do you want to build?',
    choices: utils.config.getChoices('verticalAppTypes'),
    default: utils.config.getDefaultChoice('verticalAppTypes')
  },
  {
    type: 'list',
    name: 'verticalAppTemplate',
    message: 'Which type of template do you want to apply?',
    choices: utils.config.getChoices('verticalAppTemplate'),
    default: utils.config.getDefaultChoice('verticalAppTemplate')
  }
];
