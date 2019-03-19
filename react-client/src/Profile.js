import React from 'react';
import { FirebaseAuthComponent, firebase } from './lib/firebase';
import { valueOf } from 'microstates';

export default function Profile({ user, mammals }) {
  const displayName = user.displayName.state;
  const mammalObjects = valueOf(mammals);

  return (
    <main>
      {!user.isAnonymous ? (
        <div>
          <h1>Hey, {displayName}</h1>
          <button onClick={() => firebase.auth().signOut()}>Sign out</button>
          <h2>Votes</h2>
          <ul>
            {mammalObjects
              .filter(({ vote }) => vote)
              .map(({ vote }) => {
                return (
                  <li key={vote.mammalId}>
                    {vote.mammalId} - {vote.wouldDrink ? 'yep' : 'nope'}
                  </li>
                );
              })}
          </ul>
        </div>
      ) : (
        <div>
          <h1>Sign in to save your progress!</h1>
          <FirebaseAuthComponent />
        </div>
      )}
    </main>
  );
}
