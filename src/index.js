import ModA from './modules/moda';
import ModB from './modules/modb'
import React from 'react';
import Root from './root';
import { render } from 'react-dom';

const m = 'mmm';

window.onload = () => {
  console.log('window load', new Date())
}

const root = document.getElementById('root');
render(<Root />, root);
