import React, { useEffect, useState } from 'react';
import { api } from './lib/api';
import { valueOf } from 'microstates';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import 'chartist/dist/chartist.css';
import ChartistGraph from 'react-chartist';
import { FirebaseAuthComponent } from './lib/firebase';
import { Link } from 'react-router-dom';

const padding = '1rem';

const Block = styled('div')`
  margin: 0 auto 1rem;
  padding: ${padding};
  width: 40rem;
  max-width: 100%;
`;

const Plot = styled('div')`
  width: calc(100% + 2rem + ${padding});
  padding: 1rem 0 0;
  margin-left: -2rem;
`;

const GreenPlot = styled(Plot)`
  .ct-bar {
    stroke: green !important;
  }
`;

const MammalImages = styled('div')`
  display: flex;
  align-items: flex-start;
`;

export default function Metrics({ user, mammals }) {
  const mammalObjects = valueOf(mammals);
  const [scores, updateScores] = useState([]);

  useEffect(() => {
    api.getVoteCounts().then(voteCounts => {
      updateScores(getScores(voteCounts));
    });
  }, []);

  const limit = 5;
  const mostPopular = getMammalsWithScores(
    mammalObjects,
    scores.slice(0, limit)
  );
  const leastPopular = getMammalsWithScores(
    mammalObjects,
    scores.slice(scores.length - limit).reverse()
  );

  const mostPopularChartData = {
    labels: mostPopular.map(({ name }) => name),
    series: [mostPopular.map(({ score }) => score)],
  };

  const mostPopularChartOptions = {
    high: Math.floor(
      (mostPopular.reduce((max, { score }) => (max > score ? max : score), 0) +
        1) *
        1.1
    ),
    low: 0,
    axisX: { showGrid: false },
    // axisY: { showLabel: false },
  };

  const leastPopularChartData = {
    labels: leastPopular.map(({ name }) => name),
    series: [leastPopular.map(({ score }) => score)],
  };

  const leastPopularChartOptions = {
    low: Math.ceil(
      (leastPopular.reduce((min, { score }) => (min < score ? min : score), 0) -
        1) *
        1.1
    ),
    high: 0,
    axisX: { showGrid: false },
    // axisY: { showLabel: false },
  };

  return (
    <main>
      <h1>Votes</h1>
      <Block>
        <h2>The Leaderboard</h2>
        <p>One might say, la crème de la crème.</p>
        <GreenPlot
          css={css`
            background: red;
            .ct-bar {
              stroke: green;
            }
          `}
        >
          <ChartistGraph
            data={mostPopularChartData}
            options={mostPopularChartOptions}
            type={'Bar'}
          />
        </GreenPlot>
        <MammalImages>
          {mostPopular.map(({ name, image }) => {
            const src = `/mammals/${image.src.replace(/\\/g, '')}`;
            const margin = '.5rem';
            return (
              <img
                key={src}
                src={src}
                alt={name}
                style={{
                  margin: `0 ${margin}`,
                  width: `calc(${100 /
                    mostPopular.length}% - ${margin} - ${margin})`,
                }}
              />
            );
          })}
        </MammalImages>
      </Block>
      <Block>
        <h2>The Least Desirable</h2>
        <p>Not gonna milk these gals any time soon..</p>
        <Plot>
          <ChartistGraph
            data={leastPopularChartData}
            options={leastPopularChartOptions}
            type={'Bar'}
          />
        </Plot>
        <MammalImages>
          {leastPopular.map(({ name, image }) => {
            const src = `/mammals/${image.src.replace(/\\/g, '')}`;
            const margin = '.5rem';
            return (
              <img
                key={src}
                src={src}
                alt={name}
                style={{
                  margin: `0 ${margin}`,
                  width: `calc(${100 /
                    leastPopular.length}% - ${margin} - ${margin})`,
                }}
              />
            );
          })}
        </MammalImages>
      </Block>

      <Block style={{ textAlign: 'center' }}>
        <hr
          style={{
            border: 'none',
            borderBottom: '1px solid #e7e7e7',
            margin: '2rem 0',
          }}
        />
        {user.isAnonymous ? (
          <div>
            Sign in to have your votes counted towards these totals! Until then,
            we'll just store them on your device.
            <FirebaseAuthComponent />
          </div>
        ) : (
          <div>
            <p>Thanks for signing in! You're votes have been counted.</p>
            <Link to="/">
              <button>Keep Swiping</button>
            </Link>
          </div>
        )}
      </Block>
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

function getMammalsWithScores(mammalObjects, scores) {
  if (!mammalObjects.length || !scores.length) return [];
  return scores
    .map(([id, score]) => {
      const mammal = mammalObjects.find(m => m.id === id);
      return Object.assign({}, mammal, { score });
    })
    .filter(({ id }) => !!id);
}
