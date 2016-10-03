'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-washemo-20:verticalAppLegacy:simple', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/verticalAppLegacy'))
      .withPrompts({
        appName: 'temp',
        verticalAppType: 'poc',
        verticalAppTemplate: 'simple'
      })
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      'temp/app.js',
      'temp/index.html'
    ]);

    assert.noFile([
      'temp/package.json'
    ])
  });
});

describe('generator-washemo-20:verticalAppLegacy:full', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/verticalAppLegacy'))
      .withPrompts({
        appName: 'temp',
        verticalAppType: 'poc',
        verticalAppTemplate: 'full'
      })
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      'temp/app.js',
      'temp/index.html',
      'temp/bower.json',
      'temp/package.json',
      'temp/README.md'
    ]);
  });
});
