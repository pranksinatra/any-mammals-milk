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

        // User logged in.
        if (firebaseUser) {
          const userId = firebaseUser.uid;
          api
            // Get any prior saved votes for just-logged-in user, and delete anonymous user
            .getUserVotes(
              userId,
              user.isAnonymous ? valueOf(user.id) : undefined
            )
            .then(fetchedVotes => {
              const anonymousVotes = user.isAnonymous
                ? valueOf(user.votes)
                : [];

              // Merge anonymous votes w/ user's votes from fetched from firebase, keeping the newer of the two
              const uniqueVotes = [];
              [...anonymousVotes, ...fetchedVotes].forEach(vote =>
                addOrReplace(vote, uniqueVotes)
              );

              // Send any anonymous votes that are more recent than the votes in firebase
              anonymousVotes
                .filter(vote => uniqueVotes.includes(vote))
                .forEach(vote => {
                  api.recordVote(userId, vote);
                });

              // Update user
              user.update(firebaseUser, uniqueVotes);
            })
            .catch(error => {
              console.error('Unable to get user votes', error);

              // Prevent further issues
              firebase.auth().signOut();
            });
        }
        // User logged out.
        else if (!isInitialState) {
          // Send any unsent votes for just-logged-out user.
          api.sendVotes(valueOf(user.id));
          // Update model to anonymous user
          user.update(undefined, []);
        }
        // App booted up with anonymous user.
        else {
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
