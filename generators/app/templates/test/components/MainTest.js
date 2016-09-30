/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import createComponent from 'helpers/shallowRenderHelper';

import Main from 'components/Main';
import {given} from 'mocha-testdata';

describe('MainComponent', () => {
  let MainComponent;

  beforeEach(() => {
    MainComponent = createComponent(Main);
  });

  it('should have its component name as default className', () => {
    expect(MainComponent.props.className).to.equal('index');
  });

  given(
    'david',
    'angel',
    'luis',
    'dani'
  )
    .it('should render the component', (name) => {

      const component = TestUtils.renderIntoDocument(
        <Main name={name}/>
      );
      const domComponent = ReactDom.findDOMNode(component);

      expect(domComponent.textContent).to.equal(`Hello ${name}`);
    });
});
