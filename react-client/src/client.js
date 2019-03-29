import App from './App';
import { BrowserRouter, withRouter } from 'react-router-dom';
import React from 'react';
import withAnalytics from './lib/analytics';
import { hydrate } from 'react-dom';

const AppWithTrackedRoutes = withRouter(withAnalytics(App));

hydrate(
  <BrowserRouter>
    <AppWithTrackedRoutes />
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
