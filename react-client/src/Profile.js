import React from 'react';
import Nav from './Nav.js';
import { FirebaseAuthComponent, firebase } from './lib/firebase';
import { getUserNickname } from './lib/user';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { props } = this;

    return (
      <div>
        <Nav />
        {props.isSignedIn ? (
          <div>
            <h1>Hey, {getUserNickname()}</h1>
            <button onClick={() => firebase.auth().signOut()}>Sign out</button>
          </div>
        ) : (
          <div>
            <h1>Sign in to save your progress!</h1>
            <FirebaseAuthComponent />
          </div>
        )}
      </div>
    );
  }
}

export default Profile;
