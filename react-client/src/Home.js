import React from 'react';
import Swipe from './Swipe';
import { Link } from 'react-router-dom';
import { valueOf } from 'microstates';
import { api } from './lib/api';

export default function Home({ user, mammals }) {
  const mammalObjects = valueOf(mammals);
  const votes = valueOf(user.votes);
  let yesVoteCount = votes.reduce(
    (sum, { wouldDrink }) => sum + (wouldDrink ? 1 : 0),
    0
  );
  let noVoteCount = votes.length - yesVoteCount;

  const handleVote = (mammal, wouldDrink) => {
    console.log('Voted for mammal', mammal.id, wouldDrink);
    const vote = {
      wouldDrink,
      voteDate: Date.now(),
      mammalId: mammal.id,
    };
    user.addVote(vote);
    api.recordVote(valueOf(user.id), vote);
  };

  const swipeableMammals = getMammalsWithoutVotes(mammalObjects, votes, 3);

  return (
    <main>
      <h1 style={{ maxWidth: '100%', width: '500px', margin: '0 auto' }}>
        Would you drink this mammal's&nbsp;milk?
      </h1>
      <Swipe mammals={swipeableMammals} onVote={handleVote} />
      <div
        style={{
          padding: '1rem',
          width: '300px',
          maxWidth: '100%',
          margin: '0 auto 2rem',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Your Preferences:</h2>
        <ul>
          <li>Voted "Yes" for {yesVoteCount} mammals</li>
          <li>Voted "No" for {noVoteCount} mammals</li>
        </ul>
        {votes.length ? (
          <p>The verdict: {getVerdict(yesVoteCount, noVoteCount)}</p>
        ) : (
          ''
        )}
        {user.isAnonymous && (
          <div>
            <Link to="/metrics/">Sign In</Link> to save your preferences!
          </div>
        )}
      </div>
    </main>
  );
}

/**
 * Get up to {total} mammals that haven't been voted on
 * @param {array} mammals
 * @param {array} votes
 * @param {number} total
 */
function getMammalsWithoutVotes(mammals, votes, total) {
  let enoughMammals = false;
  return mammals.reduce((arr, mammal) => {
    if (enoughMammals) return arr;
    if (votes.every(vote => vote.mammalId !== mammal.id)) {
      arr.push(mammal);
      if (arr.length === total) enoughMammals = true;
    }
    return arr;
  }, []);
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
