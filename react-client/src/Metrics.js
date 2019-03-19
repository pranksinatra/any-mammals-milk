import React, { useEffect, useState } from 'react';
import { api } from './lib/api';

export default function Metrics({ user }) {
  const [scores, updateScores] = useState([]);

  useEffect(() => {
    api.getVoteCounts().then(voteCounts => {
      updateScores(getScores(voteCounts));
    });
  }, []);

  const limit = 5;
  const mostPopular = scores.slice(0, limit);
  const leastPopular = scores.slice(scores.length - limit);

  return (
    <main>
      <h1>A Modern Milk Marketplace</h1>
      <h2>The Leaderboard</h2>
      <p>One might say, la crème de la crème.</p>
      <h2>The Looserboard</h2>
      <p>Not gonna milk these gals any time soon..</p>
    </main>
  );
}

// Get net votes (scores) for each mammal (would-drink votes minus would-not-drink votes)
// and sort them
// [ ['hippotragus-equinus', 3], ['equus-africanus', -2], ...more tuples ]
function getScores(voteCounts) {
  return Object.entries(voteCounts)
    .map(([mammalId, [wouldDrink, wouldNotDrink]]) => {
      return [mammalId, wouldDrink - wouldNotDrink];
    })
    .sort((a, b) => {
      return a[1] > b[1] ? -1 : 1;
    });
}
