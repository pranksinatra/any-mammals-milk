import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from './Home';
import Metrics from './Metrics';
import './global.css';

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/metrics/" component={Metrics} />
  </Switch>
);

export default App;
