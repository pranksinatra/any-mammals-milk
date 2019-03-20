import React from 'react';
import Swipe from './Swipe';
import { valueOf } from 'microstates';
import { api } from './lib/api';
import Preferences from './Preferences';

export default function Home({ user, mammals }) {
  const mammalObjects = valueOf(mammals);
  const votes = valueOf(user.votes);

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
      <Preferences
        user={user}
        isCentered={true}
        style={{ margin: '0 auto 2rem' }}
      />
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
