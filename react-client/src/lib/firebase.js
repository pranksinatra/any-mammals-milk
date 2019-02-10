import * as firebase from 'firebase/app';
import 'firebase/auth';

import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
const config = {
  apiKey: 'AIzaSyCuTkaR8VyHrjXQFwoLzwIQ6zmrgXw6F54',
  authDomain: 'any-mammals-milk.firebaseapp.com',
  databaseURL: 'https://any-mammals-milk.firebaseio.com',
  projectId: 'any-mammals-milk',
  storageBucket: 'any-mammals-milk.appspot.com',
  messagingSenderId: '612272948686',
};
firebase.initializeApp(config);

// Initialize styled Firebase Auth Component
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Avoid redirects after sign-in.
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

const FirebaseAuthComponent = () => (
  <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
);

export { firebase, FirebaseAuthComponent };
