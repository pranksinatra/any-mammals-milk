import { shuffle } from './utils';
import { debounce } from 'debounce';
// import {firebaseApp} from './firebase';

class API {
  constructor() {
    const isDev = process.env.NODE_ENV !== 'production';
    this.functionsPath = isDev
      ? 'http://localhost:5000/any-mammals-milk/us-central1/'
      : 'https://us-central1-any-mammals-milk.cloudfunctions.net/';

    // Send votes at most once every 3 seconds
    this.sendVotesDebounced = debounce(this.sendVotes, 3000);

    // Queue of votes to send to firebase
    this.userId = null;
    this.votes = [];

    // Send any remaining votes before user exits the page
    if (typeof window !== 'undefined') {
      window.addEventListener('unload', () => {
        this.sendVotes(this.userId, true);
      });
    }
  }

  postToFirebase(functionName, data) {
    const url = `${this.functionsPath}${functionName}`;
    return fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  sendBeacon(functionName, data) {
    const url = `${this.functionsPath}${functionName}`;
    return navigator.sendBeacon(url, JSON.stringify(data));
  }

  getMammals(fromAPI = false) {
    // Save 300 read queries by using local JSON file instead of asking
    // Firebase. Remember to update this file when adding new mammals
    const query = fromAPI
      ? this.postToFirebase('getMammals')
      : fetch('/mammals-v2.json');

    return query
      .then(r => r.json())
      .then(({ mammals, error }) => {
        if (error) {
          console.error('Unable to get mammals:', error);
          return [];
        }
        return shuffle(mammals);
      });
  }

  // createUpdateUser(firebaseUser) {
  //   const { uid, displayName, email, loginDate = Date.now() } = firebaseUser;
  //   if (!uid) {
  //     return Promise.reject('Firebase user missing uid');
  //   }

  //   return this.postToFirebase('createUpdateUser', {
  //     id: uid,
  //     displayName,
  //     email,
  //     loginDate,
  //   }).then(r => r.json());
  // }

  getUserVotes(userId, anonymousUserIdToDelete) {
    return this.postToFirebase('getVotes', {
      userId,
      anonymousUserIdToDelete,
    })
      .then(r => r.json())
      .catch(console.error)
      .then(votes => (Array.isArray(votes) ? votes : []));
  }

  recordVote(userId, vote) {
    // New user
    if (userId !== this.userId) {
      // Throw away any unsent votes for prior user
      if (this.votes.length) {
        console.error(
          `${this.votes.length} votes for user ${
            this.userId
          } were not sent b/c user changed`
        );
      }
      this.votes = [];
      this.userId = userId;
    }

    // console.log('recording vote', { userId, vote });

    // Add new votes to queue
    this.votes.push(vote);

    // Send votes to the server every 3 seconds or so
    this.sendVotesDebounced(this.userId);
  }

  /**
   * Send votes to Firebase
   * @param {string/null} userId
   * @return {Promise/boolean}
   */
  sendVotes(userId, useBeacon = false) {
    if (!userId || !this.votes.length) return Promise.resolve();

    // Get all votes and reset queue
    const votes = this.votes.splice(0);

    const data = {
      userId,
      votes,
    };

    // console.log('sending votes', { userId, votes });

    if (useBeacon) {
      return this.sendBeacon('saveVotes', data);
    }

    return this.postToFirebase('saveVotes', data)
      .then(r => r.json())
      .then(console.log)
      .catch(error => {
        console.error('Unable to send votes', { userId, votes }, error);

        // Add unrecorded votes back to the beginning of the queue
        if (userId === this.userId) {
          this.votes.splice(0, 0, ...votes);
          this.sendVotesDebounced(userId);
        } else {
          console.log('Votes will not be re-sent b/c userId changed');
        }
      });
  }

  getVoteCounts(fromAPI = false) {
    // Save a bunch of read queries by using local JSON file instead of asking
    // Firebase. Remember to update this file frequently (via a cron)
    const query = fromAPI
      ? this.postToFirebase('countVotes')
      : fetch('/vote-counts-v4.json');

    return query.then(r => r.json()).catch(console.error);
  }
}

export const api = new API();
