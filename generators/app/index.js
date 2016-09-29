'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
let utils = require('../../utils/all');
let prompts = require('./prompts');
let path = require('path');
let fs = require('fs');
const packageInfo = require('../../package.json');

// Set the base root directory for our files
// let baseRootPath = path.dirname(require.resolve('react-webpack-template'));

//noinspection JSUnusedGlobalSymbols
module.exports = generators.Base.extend({
  // The name `constructor` is important here
  constructor: function () {

    console.log('Generator Constructor');
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);

    // Next, add your custom code
    this.option('coffee'); // This method adds support for a `--coffee` flag

    // Make options available
    this.option('skip-welcome-message', {
      desc: 'Skip the welcome message',
      type: Boolean,
      defaults: false
    });
    this.option('skip-install');

    // Use our plain template as source
    // this.sourceRoot(baseRootPath);

    this.config.save();
  },

  initializing: function () {
    if (!this.options['skip-welcome-message']) {
      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the great ' + chalk.red('generator-washemo-20') + ' generator!'
      ));
      this.log('Out of the box I include Webpack and some default React components.\n');
    }
  },

  prompting: function () {

    var prompts = [{
      type: 'confirm',
      name: 'someAnswer',
      message: 'Please choose your application name',
      default: true
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  creatingFolder: function () {

    this.log('creating folder structure');

    mkdirp.sync('./test');
  },

  configuring: function() {

  },

  writing: function () {
    //Copy the configuration files
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'), {
        name: this.props.name
      }
    );

    //Copy application files

    //Install Dependencies

  },

  install: function () {
    if(!this.options['skip-install']) {
      this.installDependencies();
    }
  }
});
