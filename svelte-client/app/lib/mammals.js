import { api } from './api';
import { utils } from './utils';

class Mammals {

	constructor() {
		this.mammals = [];
		this.votesByMammal = null;
	}

	getMammals() {
		return new Promise((resolve, reject) => {

			if ( this.mammals.length ) {
				return resolve(this.mammals);
			}

			api
				.getMammals()
				.then(mammals => {
					this.mammals = utils.shuffle(mammals);

					// For debugging
					console.log(`Fetched ${mammals.length} mammals`);
					window.mammals = mammals;
					
					return resolve(this.mammals);
				})
				.catch(err => {
					reject(err);
				});

		});
	}

	getVotesByMammal() {
		return new Promise((resolve, reject) => {

			if ( this.votesByMammal ) {
				return resolve(this.votesByMammal);
			}

			api
				.getVotesByMammal()
				.then(votes => {
					this.votesByMammal = votes;
					return resolve(votes);
				})
				.catch(err => {
					reject(err);
				});

		});
	}

}

export const mammals = new Mammals();