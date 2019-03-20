import React from 'react';
import { FirebaseAuthComponent, firebase } from './lib/firebase';
import { valueOf } from 'microstates';
import styled from '@emotion/styled';
import Preferences from './Preferences';

const Block = styled('div')`
  margin: 0 auto 1rem;
  padding: 1rem;
  width: 40rem;
  max-width: 100%;
`;

const Button = styled('button')`
  display: block;
  margin: 0 auto;
`;

export default function Profile({ user, mammals }) {
  const firstName = user.displayName.state.split(' ')[0];

  const heading = user.isAnonymous ? `Hey there!` : `Hey ${firstName}!`;

  return (
    <main>
      <h1 style={{ marginBottom: 0 }}>{heading}</h1>
      <Block>
        <p style={{ textAlign: 'center', marginTop: 0 }}>
          Thanks for stopping by.
        </p>
        <Preferences user={user} isCentered={true} />
        {!user.isAnonymous ? (
          <Button onClick={() => firebase.auth().signOut()}>Sign out</Button>
        ) : (
          ''
        )}
      </Block>
    </main>
  );
}
