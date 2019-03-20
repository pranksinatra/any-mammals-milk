import React from 'react';
import { FirebaseAuthComponent } from './lib/firebase';
import { valueOf } from 'microstates';
import styled from '@emotion/styled';

const Wrapper = styled('div')`
  padding: 1rem;
  width: 300px;
  maxwidth: 100%;
`;

export default function Preferences({ user, style = {}, isCentered = false }) {
  const votes = valueOf(user.votes);
  let yesVoteCount = votes.reduce(
    (sum, { wouldDrink }) => sum + (wouldDrink ? 1 : 0),
    0
  );
  let noVoteCount = votes.length - yesVoteCount;

  const wrapperStyle = isCentered ? { margin: '0 auto' } : {};
  const centeredText = isCentered ? { textAlign: 'center' } : {};

  Object.assign(wrapperStyle, style);

  return (
    <Wrapper style={wrapperStyle}>
      <h2 style={centeredText}>Your Preferences:</h2>
      <ul>
        <li>Voted "Yes" for {yesVoteCount} mammals</li>
        <li>Voted "No" for {noVoteCount} mammals</li>
      </ul>
      {votes.length ? (
        <p style={centeredText}>
          The verdict: {getVerdict(yesVoteCount, noVoteCount)}
        </p>
      ) : (
        ''
      )}
      {user.isAnonymous && (
        <div style={centeredText}>
          Sign in to save your progress and add your votes to the total!
          <FirebaseAuthComponent />
        </div>
      )}
    </Wrapper>
  );
}

/**
 * Generate a description of the user based on their votes
 * @param {number} yesVoteCount
 * @param {number} noVoteCount
 */
function getVerdict(yesVoteCount, noVoteCount) {
  if (yesVoteCount + noVoteCount < 3) {
    return `ya lazy (keep votin')`;
  }
  if (yesVoteCount > noVoteCount) {
    if (isGreater(2, yesVoteCount, noVoteCount)) {
      return `you're very thirsty`;
    }
    if (isGreater(3, yesVoteCount, noVoteCount)) {
      return `you're extremely thirsty`;
    }
    return `you're a little thirsty`;
  } else {
    if (isGreater(2, noVoteCount, yesVoteCount)) {
      return `you're a picky boy`;
    }
    if (isGreater(3, noVoteCount, yesVoteCount)) {
      return `you're a VERY picky boy`;
    }
    return `you're a little picky`;
  }

  function isGreater(factor, a, b) {
    return a > b * factor && a > b + factor * 2;
  }
}
