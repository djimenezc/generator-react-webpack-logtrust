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

  it('getChoices with the description in the name field', function () {

    const actual = config.getChoices('verticalAppTypes');
    const expected = 'PoC ---- ';

    assert.ok(actual[0].name.indexOf(expected) !== -1, 'getDefaultChoice fetch successfully!!!');
  });
});
