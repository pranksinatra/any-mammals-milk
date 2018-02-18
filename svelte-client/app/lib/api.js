class API {
	constructor() {
		this.baseURL = 'http://api.micahjon.com/any-mammals-milk/api-server';

		this.voteQueue = [];
		this.voteInterval = 3000;
		this.voteTimeout = null;

		this.userId = null;

		// Send any remaining votes before user exits the page
		window.onbeforeunload = () => {
			if (this.userId && this.voteQueue.length) {
				this._sendVotes(this.userId, this.voteQueue);
			}
		};
	}

	getMammals() {
		return (
			fetch('/full.min.json')
				.then(r => r.json())
				// Create image URLs
				// Escape single quotes and parenthesis for background images
				.then(mammals =>
					mammals.map(mammal => {
						mammal.image = '/mammals/' + mammal.image.replace(/['()]/g, '\\$&');
						return mammal;
					})
				)
		);
	}

	recordVote({ userId, mammalId, vote }) {
		// User id has changed.
		if (userId !== this.userId) {
			// Send any remaining votes associated w/ the prior user
			if (this.voteQueue.length) {
				this._sendVotes(this.userId, this.voteQueue);
			}

			// Reset queue
			this.userId = userId;
			this.voteQueue = [];
		}

		// Add vote to queue to save to server
		this.voteQueue.push({ mammalId, vote });

		// Send votes to the server every 3 seconds or so
		clearTimeout(this.voteTimeout);
		this.voteTimeout = setTimeout(() => {
			if (!this.voteQueue.length) return;

			const sentVotes = this.voteQueue.splice(0);

			this._sendVotes(userId, sentVotes)
				.then(() =>
					console.log(
						`Recorded ${sentVotes.length} vote${sentVotes.length > 1 ? 's' : ''}`
					)
				)
				.catch(error => {
					console.log('Failed to record votes');
					console.error(error);

					// Add unrecorded votes back on to the queue
					this.voteQueue.splice(0, 0, ...sentVotes);
				});
		}, this.voteInterval);
	}

	_sendVotes(userId, votes) {
		const url = `${this.baseURL}/vote.php/?data=${JSON.stringify({ userId, votes })}`;

		return fetch(url)
			.then(r => r.json())
			.then(({ success, error }) => {
				if (!success) throw error;
			});
	}

	saveUserData(user) {
		const url = `${this.baseURL}/add-user.php/?data=${JSON.stringify(user)}`;

		return fetch(url)
			.then(r => r.json())
			.then(({ success, error }) => {
				if (!success) throw error;
			});
	}

	// getUserVotes

	// saveUserVotes

	// getVotes

	// getJSON(url, callback) {
	// 	return new Promise((resolve, reject) => {
	// 		var request = new XMLHttpRequest();

	// 		request.onload = function() {
	// 			if (this.status >= 200 && this.status < 400) {
	// 				// Success!
	// 				const data = JSON.parse(this.response);
	// 				resolve(data);
	// 			} else {
	// 				// We reached our target server, but it returned an error
	// 				reject(`Server error #${this.status}`);
	// 			}
	// 		};

	// 		request.onerror = request.onabort = () => reject('Request failed');

	// 		request.open('GET', url, true);
	// 		request.send();
	// 	});
	// }
}

export const api = new API();
