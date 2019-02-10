import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from './Home';
import Metrics from './Metrics';
import Profile from './Profile';
import { firebase } from './lib/firebase';
import './global.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
    };
  }

  componentDidMount() {
    // Bind sign-in state
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => this.setState({ isSignedIn: !!user }));

    // Make debugging easier (@todo -> remove in production)
    window.currentUser = firebase.auth().currentUser;
    console.log('current user:', window.currentUser);
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={props => (
            <Home {...props} isSignedIn={this.state.isSignedIn} />
          )}
        />
        <Route
          exact
          path="/metrics/"
          render={props => (
            <Metrics {...props} isSignedIn={this.state.isSignedIn} />
          )}
        />
        <Route
          exact
          path="/profile/"
          render={props => (
            <Profile {...props} isSignedIn={this.state.isSignedIn} />
          )}
        />
      </Switch>
    );
  }
}

export default App;
