import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './views/containers/App/App.jsx'

import { setupStore } from './config_store'

if (ENV === 'dev')
  window.enableLog = true;

render((
  <HashRouter>
    <Provider store={setupStore()}>
      <App/>
    </Provider>
  </HashRouter>
), document.getElementById('root'));


