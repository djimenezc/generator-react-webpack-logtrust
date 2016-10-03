'use strict';

var generator = require('yeoman-generator');
var chalk = require('chalk');
var yoSay = require('yosay');
var mkdirp = require('mkdirp');
let utils = require('../../utils/all');
let prompts = require('./prompts');
let path = require('path');
let fs = require('fs');
const packageInfo = require('../../package.json');
const pathExists = require('path-exists');

//noinspection JSUnusedGlobalSymbols
module.exports = generator.Base.extend({
  // The name `constructor` is important here
  constructor: function () {

    console.log('Generator Constructor');
    // Calling the super constructor is important so our generator is correctly set up
    generator.Base.apply(this, arguments);

    // Make options available
    this.option('skip-welcome-message', {
      desc: 'Skip the welcome message',
      type: Boolean,
      defaults: false
    });
    this.option('skip-install');
  },

  initializing: function () {
    if (!this.options['skip-welcome-message']) {
      // Have Yeoman greet the user.
      this.log(yoSay(
        'Welcome to the great ' + chalk.red('generator-washemo-20')
        + ' verticalAppLegacy generator!'
      ));
    }
  },

  prompting: function () {

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;

      // Make sure to get the correct app name if it is not the default
      if (props.appName !== utils.yeoman.getAppName()) {
        props.appName = utils.yeoman.getAppName(props.appName);
      }

      // Set needed global vars for yo
      this.appName = props.appName;
      this.verticalAppType = props.verticalAppType;
      this.verticalAppTemplate = props.verticalAppTemplate;
      this.generatedWithVersion = packageInfo.version.split('.').unshift();

    }.bind(this));
  },

  configuring: function () {

    this.log('creating folder structure at ', this.appName);

    mkdirp.sync(this.appName);
  },

  writing: function () {

    let excludeList = [
      'node_modules',
      'package.json',
      '_package.ejs.json',
      '.travis.yml'
    ];

    // Get all files in our repo and copy the ones we should

    const templateFolder = this.templatePath(this.verticalAppTemplate);

    this.log(`Building using ${this.verticalAppTemplate} template ${templateFolder}`);

    fs.readdir(this.templatePath(this.verticalAppTemplate), (err, items) => {

      for (let item of items) {

        // Skip the item if it is in our exclude list
        if (excludeList.indexOf(item) !== -1) {
          continue;
        }

        // Copy all items to our root
        let fullPath = path.join(templateFolder, item);

        if (fs.lstatSync(fullPath).isDirectory()) {
          this.bulkDirectory(`${this.verticalAppTemplate}/${item}`, `${this.appName}/${item}`,null);
        } else {
          this.copy(`${this.verticalAppTemplate}/${item}`, `${this.appName}/${item}`);
        }
      }
    });

    pathExists(this.templatePath(`${this.verticalAppTemplate}/_package.ejs.json`)).then(exists => {

      if(exists) {
        console.log(`${this.verticalAppTemplate}/_package.ejs.json exists!!! ${exists}`);
        // Copy the package.json filtered
        this.fs.copyTpl(
          this.templatePath(`${this.verticalAppTemplate}/_package.ejs.json`),
          this.destinationPath(`${this.appName}/package.json`), {
            name: this.appName
          }
        );
      }

    });
  },

  install: function () {

    if(this.verticalAppTemplate === 'simple') {
      this.options['skip-install'] = true;
    }

    if (!this.options['skip-install']) {

      mkdirp.sync(`${this.appName}/node_modules`);

      this.runInstall('npm', [], {
        prefix: this.destinationPath(this.appName)
      });
    }
  },

  end: function() {
    this.log('Good bye chap');
  }
});
