import lscache from 'lscache';
import { api } from './api';

class Auth {

	constructor() {

		this.user = null;
		this.version = 1;

		this.userUpdateListeners = [];

		this.isLocal = window.location.host.startsWith('localhost');
		this.hasAccessToken = window.location.hash.includes('access_token');

		// Don't ask for re-authentication if user has already been logged in
		// in a prior session on this computer
		const cachedUser = lscache.get('user');
		if ( cachedUser && cachedUser.id && cachedUser._version === this.version ) {
			this.setUser(cachedUser, false);
		}

		// Load Auth0 JS library
		this.loadAuth0 = new Promise(resolve => {
			checkIfLoaded();
			function checkIfLoaded() {
				if ( window.auth0 ) resolve();
				else setTimeout( checkIfLoaded, 100 );
			}
		});

		this.loadAuth0.then(() => {
			this.webAuth = new auth0.WebAuth({
				domain: 'any-mammals-milk.auth0.com',
				clientID: '8kL5tAS66BwF7gphZQURQwwGR720ofy5',
				responseType: 'token id_token',
				audience: 'https://any-mammals-milk.auth0.com/userinfo',
				scope: 'openid profile email',
				redirectUri: window.location.href
			});
		});

	}

	addUpdateListener(listener) {
		
		this.userUpdateListeners.push(listener);

	}

	notifyListeners() {

		this.userUpdateListeners.forEach(listener => listener && listener(this.user));

	}

	getUser() {
		return new Promise((resolve, reject) => {
			
			if ( this.user ) {
				return resolve(this.user);
			}

			// After authenticating w/ Auth0, the user will be redirected w/ an access token
			if ( ! this.hasAccessToken ) {
				return reject('User has not logged in yet');
			}

			this.loadAuth0.then(() => {

				// Use access token in URL to get user data
				this.webAuth.parseHash((err, authResult) => {
					if ( authResult && authResult.accessToken && authResult.idTokenPayload ) {

						// Remove hash in URL 
						window.location.hash = '';
						
						// Got user data!
						const userData = authResult.idTokenPayload;
						const user = { 
							id: userData.sub,
							email: userData.email,
							last_name: userData.family_name,
							first_name: userData.given_name,
							gender: userData.gender,
							image: userData.picture,
							_version: this.version,
						};

						this.setUser(user);
						return resolve(user);
					} 
					// Unable to authenticate for some reason
					reject(err);
				});

			}).catch(err => {
				// Unable to load Auth0 JS library
				reject(err);
			});
		});
	}

	login() {
		// Generate test user for local use
		if ( this.isLocal ) {
			
			const user = {
				id: 'test-user|' + Math.round(Math.random() * 1000000),
				email: 'jaredmoneymiller@gmail.com',
				last_name: 'Miller',
				first_name: 'Jared',
				gender: 'male',
				image: 'http://anymammalsmilk.com/jared.jpg',
				_version: this.version,
			};

			return this.setUser(user);
		}

		// Use Auth0 to handle oAuth login w/ user's preferred social provider
		// User will then be redirected back to the homepage w/ an access key
		this.loadAuth0.then(() => this.webAuth.authorize());
	}

	logout() {
		
		this.user = null;

		lscache.remove('user');

		this.notifyListeners();

	}

	setUser(user, persist = true) {

		this.user = user;

		// Cache user data for a week
		if ( persist ) lscache.set('user', user, 60 * 24 * 7);

		this.notifyListeners();

		api.saveUserData(user)
			.then(() => console.log('Saved user data'))
			.catch(error => {
				console.log('Unable to save user data');
				console.error(error);
			});

	}

}

export const auth = new Auth();