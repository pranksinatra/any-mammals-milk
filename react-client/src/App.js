import React, { useEffect } from 'react';
import './global.css';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from './Home';
import Metrics from './Metrics';
import Profile from './Profile';
import { firebase } from './lib/firebase';
import { api } from './lib/api';
import { valueOf } from 'microstates';
import { Model } from './lib/model';
import useType from '@microstates/react';
import Nav from './Nav';
import Footer from './Footer';
import { getLocalUser } from './lib/local';

const initialUser = getLocalUser();

// Ensure useEffect hook always references the current user object
let userMicrostateReference;

export default function App() {
  const { user, mammals } = useType(Model, {
    user: initialUser,
    mammals: [],
  });
  userMicrostateReference = user;

  if (typeof window !== 'undefined') {
    window.mammals = mammals;
    window.user = user;
    window.valueOf = valueOf;
    window.api = api;
  }

  // Listen for user login & logout
  // Only runs once, so we use currentUserReference to keep it in sync
  // with the current user Microstate
  useEffect(() => {
    let isInitialState = true;
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(firebaseUser => {
        let user = userMicrostateReference;

        // User logged in. Get any prior votes for logged-in user
        if (firebaseUser) {
          const userId = firebaseUser.uid;
          api
            .getUserVotes(userId)
            .then(fetchedVotes => {
              // Merge anonymous votes w/ user's votes from fetched from firebase
              const uniqueVotes = [];
              [...api.votes, ...fetchedVotes].forEach(vote =>
                addOrReplace(vote, uniqueVotes)
              );

              user.update(firebaseUser, uniqueVotes);
            })
            .catch(error => {
              console.error('Unable to get user votes', error);

              // Prevent further issues
              firebase.auth().signOut();
            });
        }
        // User logged out. Send votes for logged-out user and then reset vote queue
        else if (!isInitialState) {
          api.sendVotes(valueOf(user.id));
          user.update(undefined, []);
        }
        // App booted up with anonymous user. Queue up any votes from prior session
        else {
          valueOf(user.votes).forEach(vote => {
            api.recordVote('', vote);
          });
        }
        isInitialState = false;
      });
    return unregisterAuthObserver;
  }, []);

  // Get all mammals (once)
  useEffect(() => {
    let isMounted = true;
    api
      .getMammals()
      .then(mammalObjects => {
        if (isMounted) mammals.set(mammalObjects);
      })
      .catch(error => {
        console.log('Unable to fetch mammals!', error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <React.Fragment>
      <Nav />
      <Switch>
        <Route
          exact
          path="/"
          render={props => <Home {...props} user={user} mammals={mammals} />}
        />
        <Route
          exact
          path="/votes/"
          render={props => <Metrics {...props} user={user} mammals={mammals} />}
        />
        <Route
          exact
          path="/profile/"
          render={props => <Profile {...props} user={user} />}
        />
      </Switch>
      <Footer />
    </React.Fragment>
  );
}

/**
 * Add new vote if there's no mammalId conflict
 * Otherwise, keep the newer of the two conflicting votes
 * @param {object} vote
 * @param {array} votes
 */
function addOrReplace(vote, votes) {
  const conflictingVote = votes.find(
    ({ mammalId }) => mammalId === vote.mammalId
  );
  // Add new vote
  if (!conflictingVote) {
    votes.push(vote);
  }
  // Replace old vote with new vote
  else if (vote.voteDate > conflictingVote.voteDate) {
    votes.splice(votes.indexOf(conflictingVote), 1, vote);
  }
}
