import React from 'react';
import { firebase } from './lib/firebase';
import styled from '@emotion/styled';
import Preferences from './Preferences';

const Block = styled('div')`
  margin: 0 auto 1rem;
  padding: 1rem;
  width: 30rem;
  max-width: 100%;
`;

const Button = styled('button')`
  display: block;
  margin: 0 auto;
`;

export default function Profile({ user }) {
  const firstName = user.displayName.state.split(' ')[0];

  const heading = user.isAnonymous ? `Hey there!` : `Hey ${firstName},`;

  return (
    <main>
      <h1 style={{ marginBottom: 0 }}>{heading}</h1>
      <Block>
        <p style={{ textAlign: 'center', marginTop: 0 }}>
          Thanks for stopping by.
        </p>
        <p style={{ textAlign: 'center', marginTop: 0 }}>
          We're building a modern milk marketplace to better represent the
          diversity of milk producers in our community.
        </p>
        <p style={{ textAlign: 'center', marginTop: 0 }}>
          Want to get involved? Consider{' '}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeFkQEd9EW5CJJPDxsa8Liqi9MJXo7836Io32xYq1un1l7ndA/viewform?usp=sf_link"
            target="_blank"
            rel="noopener"
          >
            becoming an intern
          </a>
          .
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
