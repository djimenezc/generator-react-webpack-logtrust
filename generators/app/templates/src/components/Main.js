require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {

  static sayHello(name='') {
    return `Hello ${name}`;
  }

  render() {

    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <h1 className="notice">{AppComponent.sayHello(this.props.name)}</h1>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
