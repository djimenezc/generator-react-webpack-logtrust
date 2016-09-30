import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/Main';

console.log('Starting App');

// Render the main component into the dom
ReactDOM.render(<App name={'david'}/>, document.getElementById('app'));
