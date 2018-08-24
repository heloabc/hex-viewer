import React, { Component } from 'react';
import ModA from './modules/moda';
import ModB from './modules/modb';
// import { AppContainer } from 'react-hot-loader';
import { hot } from 'react-hot-loader';


class Root extends Component {
  render() {
    const text = 'aaa';
    const blob = new Blob([text], { type: 'text/plain '});
    const href = window.URL.createObjectURL(blob);

    return <div>
    <ModA></ModA>
    {/* <ModB></ModB> */}
  </div>
  }
}

export default hot(module)(Root);
