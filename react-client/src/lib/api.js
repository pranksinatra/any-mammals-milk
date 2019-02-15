import { shuffle } from './utils';
// import {firebaseApp} from './firebase';

class API {
  constructor() {
    // this.baseURL = 'http://api.micahjon.com/any-mammals-milk/api-server';
    this.voteQueue = [];

    this.functionsPath =
      'https://us-central1-any-mammals-milk.cloudfunctions.net/';

    // Deploying functions locally
    if (window.location.hostname === 'localhost') {
      this.functionsPath =
        'http://localhost:5000/any-mammals-milk/us-central1/';
      console.log('yep', this.functionsPath);
    } else {
      console.log('noep', window.location.hostname);
    }

    // this.firebaseApp = firebaseApp;

    // this.voteInterval = 3000;
    // this.voteTimeout = null;
    // this.userId = null;
    // Send any remaining votes before user exits the page
    // window.onbeforeunload = () => {
    // 	if (this.userId && this.voteQueue.length) {
    // 		this._sendVotes(this.userId, this.voteQueue);
    // 	}
    // };
  }

  getMammals() {
    return fetch('/full.min.json')
      .then(r => r.json())
      .then(mammals =>
        shuffle(
          mammals.map(mammal => {
            // Get id that can be used on DOM element
            mammal.htmlId = mammal.id
              .replace(' ', '-')
              .toLowerCase()
              .replace(/[^a-z-]/g, '');

            // Escape single quotes and parenthesis for background images
            mammal.imageSrc =
              '/mammals/' + mammal.image.replace(/['()]/g, '\\$&');
            return mammal;
          })
        )
      );
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

  saveUserData(userData) {
    if (!userData.uid) return Promise.reject('User missing uid');
    const userId = userData.uid;
    const loginDate = Date.now();
    const { displayName, email } = userData;

    return this.postToFirebase('addUser', {
      userId,
      loginDate,
      displayName,
      email,
    })
      .then(r => r.json())
      .then(console.log)
      .catch(console.error);
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

  // recordVote({ userId, mammalId, vote }) {
  // 	// User id has changed.
  // 	if (userId !== this.userId) {
  // 		// Send any remaining votes associated w/ the prior user
  // 		if (this.voteQueue.length) {
  // 			this._sendVotes(this.userId, this.voteQueue);
  // 		}

  // 		// Reset queue
  // 		this.userId = userId;
  // 		this.voteQueue = [];
  // 	}

  // 	// Add vote to queue to save to server
  // 	this.voteQueue.push({ mammalId, vote });

  // 	// Send votes to the server every 3 seconds or so
  // 	clearTimeout(this.voteTimeout);
  // 	this.voteTimeout = setTimeout(() => {
  // 		if (!this.voteQueue.length) return;

  // 		const sentVotes = this.voteQueue.splice(0);

  // 		this._sendVotes(userId, sentVotes)
  // 			.then(() =>
  // 				console.log(
  // 					`Recorded ${sentVotes.length} vote${sentVotes.length > 1 ? 's' : ''}`
  // 				)
  // 			)
  // 			.catch(error => {
  // 				console.log('Failed to record votes');
  // 				console.error(error);

  // 				// Add unrecorded votes back on to the queue
  // 				this.voteQueue.splice(0, 0, ...sentVotes);
  // 			});
  // 	}, this.voteInterval);
  // }

  // _sendVotes(userId, votes) {
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
