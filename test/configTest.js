'use strict';
var assert = require('yeoman-assert');
var config = require('../utils/config');

describe('config', function () {
  before(function () {

  });

  it('getDefaultChoice', function () {

    const actual = config.getDefaultChoice('verticalAppTypes');
    const expected = 'poc';

    assert.equal(actual, expected, 'getDefaultChoice fetch successfully!!!');
  });
});
