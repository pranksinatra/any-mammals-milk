import { shuffle } from './utils';
import { debounce } from 'debounce';
// import {firebaseApp} from './firebase';

class API {
  constructor() {
    const isDev =
      typeof window !== 'undefined' && window.location.hostname === 'localhost';
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
      window.onbeforeunload = () => {
        this.sendVotes(this.userId);
      };
    }
  }

  postToFirebase(functionName, data) {
    return fetch(`${this.functionsPath}${functionName}`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  getMammals() {
    // return fetch('/full.json')
    return this.postToFirebase('getMammals')
      .then(r => r.json())
      .then(({ mammals, errors }) => {
        if (errors.length) {
          console.error('Invalid mammals on server:', errors);
        }
        return shuffle(mammals);
      });
  }

  saveUserData(userData) {
    if (!userData.uid) return Promise.reject('User missing uid');
    const userId = userData.uid;
    const loginDate = Date.now();
    const { displayName, email } = userData;

    return this.postToFirebase('createUpdateUser', {
      userId,
      loginDate,
      displayName,
      email,
    })
      .then(r => r.json())
      .then(console.log)
      .catch(console.error);
  }

  getUserVotes(userId) {
    return this.postToFirebase('getVotes', {
      userId,
    })
      .then(r => r.json())
      .catch(console.error)
      .then(votes => (Array.isArray(votes) ? votes : []));
  }

  recordVote(userId, vote) {
    // New user
    if (userId !== this.userId) {
      // Send any unsent votes for prior user
      this.sendVotes(this.userId);

      // Update current user ID
      this.userId = userId;

      // No need to reset vote queue. If the prior user was anonymous (this.userId = null),
      // then we want to send these votes now that the user has logged in.
      // If the prior user was not anonymous, the vote queue is cleared above by this.sendVotes()
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
   * @return {Promise}
   */
  sendVotes(userId) {
    if (!userId || !this.votes.length) return Promise.resolve();

    // Get all votes and reset queue
    const votes = this.votes.splice(0);

    // console.log('sending votes', { userId, votes });

    return this.postToFirebase('saveVotes', {
      userId,
      votes,
    })
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

  // getVotesByMammal() {
  // 	const url = `${this.baseURL}/get-mammal-votes.php`;

  // 	return fetch(url)
  // 		.then(r => r.json())
  // 		.then(({ votes }) => {
  // 			if (!votes) throw 'Unable to get votes by mammal';
  // 			return votes;
  // 		});
  // }

  // getUserVotes(userId) {
  // 	const url = `${this.baseURL}/get-user-votes.php/?data=${JSON.stringify({ userId })}`;

  // 	return fetch(url)
  // 		.then(r => r.json())
  // 		.then(({ votes, error }) => {
  // 			if (!votes) throw error;
  // 			return votes;
  // 		});

  // }

  // sendVotes(userId, votes) {
  // 	const url = `${this.baseURL}/vote.php/?data=${JSON.stringify({ userId, votes })}`;

  // 	return fetch(url)
  // 		.then(r => r.json())
  // 		.then(({ success, error }) => {
  // 			if (!success) throw error;
  // 		});
  // }

  // saveUserData(user) {
  // 	const url = `${this.baseURL}/add-user.php/?data=${encodeURIComponent(JSON.stringify(user))}`;

  // 	return fetch(url)
  // 		.then(r => r.json())
  // 		.then(({ success, error }) => {
  // 			if (!success) throw error;
  // 		});
  // }
}

export const api = new API();
