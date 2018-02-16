<Nav page={{page}}></Nav>

<main>

	<h1 style="font-family: 'Patrick Hand'">Would you drink this mammal's milk?</h1>

	<div class="{{squareClass}}" on:mammalSwipe="updateMammmals()">
		{{#each mammals as mammal @html_id}}
		<div class="center-contents">
			<div id="{{mammal.html_id}}" class="image" style="background-image: url({{ mammal.image }}); max-width: {{ maxWidth(mammal) }}">
				<div class="aspect-ratio" style="padding-bottom: {{ padBot(mammal)}};"></div>
				<div class="caption">
					{{mammal.name}}
				</div>
			</div>
		</div>
		{{/each}}

		<div id="buttons" class="buttons" ref:buttonsContainer>
			{{#if user }}
			<button class="button--yes alt-font" on:click="onClick(true)">Yes</button>
			<button class="button--no alt-font" on:click="onClick(false)">No</button>
			{{else}}
			<button class="button--login" on:click="login()">Log in to vote on mammals!</button>
			{{/if}}
		</div>

	</div>

	{{#if user && user.email }}
	<div class="newsletter">
		<h2 class="alt-font">Get notified when your preferred mammals' milk is available!</h2>
		<form action="#" on:submit="newsletterSignup(event)">
			<input type="email" name="email" value={{user.email}} disabled>
			<button type="submit">Sign up</button>
		</form>
	</div>
	{{/if}}

</main>

<Footer></Footer>

<style>
.square {
	position: relative;
	width: 520px;
	max-width: 100%;
	margin: 2rem auto 8rem;
	/*outline: 2px solid red;*/
}
.square:before {
	content: "";
	display: block;
	padding-bottom: 80%; /* 10x8, so not perfectly square */
}
.square--no-swiping .center-contents {
	pointer-events: none;
}

.center-contents {
	position: absolute;
	top: 0; right: 0; bottom: 0; left: 0;

	display: flex;
	align-items: center;
	justify-content: center;
}
/* Current mammal */
.center-contents:first-child {
	z-index: 1;
	filter: drop-shadow(0 0 1rem rgba(0,0,0,.25));
}
/* Next mammal */
.center-contents:nth-child(2) .image {
	filter: blur(5px)
}

.image {
	/* max-width set programmatically */
	position: relative;
	flex-grow: 1;
	background-size: contain;
}
.aspect-ratio {
	/* padding-bottom set programmatically */
}
.caption {
	position: absolute;
	width: 100%;
	text-align: center;
	background-color: #f5f5f5;
	padding: .5rem 0;
}

/* ------------ */

h1 {
	text-align: center;
	margin: 0 auto;
	font-size: 2rem;
	font-weight: 700;
	margin: 4rem auto 0;
	max-width: 10em;
}

@media (min-width: 480px) {
	h1 {
		font-size: 3.2rem;
	}
}

/* ------------ */
.buttons {
	font-size: 14px;
}
.buttons button {
	position: absolute;
	top: 50%;
	z-index: 2;
}
.buttons--disabled button {
	pointer-events: none;
}

.button--login {
	left: 50%;
	transform: translateX(-50%);
}
.button--login:focus {
  box-shadow: 0 0 0 .2em rgba(0, 123, 255, 0.5);
}

.button--no {
	font-size: 1.25rem;
	left: 1rem;
	height: 3em;
	width: 3em;
	border-radius: 50%;
	background-color: rgb(220, 53, 69);
}
.button--no:hover {
	background-color: rgb(200, 35, 51);
}
.button--no:focus {
	box-shadow: 0 0 0 .2em rgba(220, 53, 69, 0.5);
}

.button--yes {
	font-size: 1.25rem;
	right: 1rem;
	height: 3em;
	width: 3em;
	border-radius: 50%;
	background-color: rgb(40, 167, 69);
}
.button--yes:hover {
	background-color: rgb(33, 136, 56);
}
.button--yes:focus {
	box-shadow: 0 0 0 .2em rgba(33, 167, 69, 0.5);
}

@media (min-width: 400px) {
	.buttons {
		font-size: 16px;
	}
}

/* ------------ */

.newsletter {
	max-width: 520px;
	width: 100%;
	margin: 2rem auto 6rem;
}
.newsletter h2 {
	font-size: 1.5rem;
	line-height: 1.5;
	text-align: center;
}
@media (min-width: 480px) {
	.newsletter h2 {
		font-size: 2rem;
	}
}
.newsletter form {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}
.newsletter input[type="email"] {
	width: 38.1%;
	min-width: 11rem;
	max-width: 15rem;
	line-height: calc( 2rem - 2px );
	font-size: 14px;
	padding: 0 .75rem;
	border: 1px solid #ebebeb;
	border-radius: 3px 0 0 3px;

}
.newsletter button {
	border-radius: 0 3px 3px 0;
	box-shadow: none;
}

</style>

<script>
import roadtrip from 'roadtrip';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import * as swing from 'swing';
import lscache from 'lscache';

const mammalSwipeEvent = 'mammalSwipe';
const loadedImages = [];

const voteQueue = [];
let voteTimeout = null;

let currentCard = null;

export default {
	components: {
		Nav, Footer
	},
	oncreate() {
		getMammals.bind(this)();
		handleAuth.bind(this)();
	},
	// Setup initial data for app
	data() {
		return {
			mammals: [],
			emptyMessage: 'Fetching mammals...',
			user: null,
		}
	},
	methods: {
		goto(path) {
			roadtrip.goto(path);
		},
		updateMammmals() {
			getUnswipedMammals().then(mammals => {
				// console.log('got new mammals', mammals);
				this.set({ mammals });
				setupCard();
			});
		},
		login() {
			// When working locally, skip authentication
			if ( window.location.host.startsWith('localhost') ) {
				const user = { 
					id: 'test-user|' + Math.round(Math.random() * 1000000),
					email: 'jaredmoneymiller@gmail.com',
					lastName: 'Miller',
					firstName: 'Jared',
					gender: 'male',
					picture: 'http://anymammalsmilk.com/jared.jpg',
				};

				this.setUser(user);
				
				return;
			}
			// Take user to external login page, then redirect back here on 
			// successful login
			window.onAuthReady.then(() => this.webAuth.authorize());
		},
		onClick(vote) {
			onClick(vote, this.refs.buttonsContainer);
		},
		newsletterSignup(event) {
			event.preventDefault();

			console.log(event);

			// console.log(data);
		},
		setUser(user, updateCache = true) {
			
			// Update 
			this.set({ user });

			// Make userId available globally for API requests
			window.userId = user.id;

			if ( updateCache ) {
				// Cache user data for a week
				lscache.set('user', user, 60 * 24 * 7);
			}
		}
	},
	events: {
		mammalSwipe(element, callback) {
			element.addEventListener(mammalSwipeEvent, callback, false);
			return {
				teardown () { 
					element.removeEventListener(mammalSwipeEvent, callback, false ); 
				}
			};
		}
	},
	helpers: {
		padBot({ width, height }) {
			return 100 / width * height + '%';
		},
		// Fit image in 10 x 8 box
		maxWidth({ width, height }) {
			const aspectRatio = width / height,
				boxRatio = 10/8;

			return 100 * ( aspectRatio > boxRatio ? 1 : ( width / height / boxRatio) ) + '%';
		}
	},
	computed: {
		squareClass: user => {
			if ( ! user ) return 'square square--no-swiping';
			return 'square';
		}
	}
}

//--

/**
 * Setup swipable card stack
 */
let windowWidth = window.innerWidth;
const stack = swing.Stack({
	allowedDirections: [ swing.Direction.LEFT, swing.Direction.RIGHT ],
	throwOutDistance: () => Math.max(windowWidth) / 4 + 200,
	
	// Make it easier to swipe left or right on a card
	throwOutConfidence: (xOffset, yOffset, element) => {

		const cardWidth = element.offsetWidth,
			cardHeight = element.offsetHeight;

		// Card's container side length.
		// Average it with card width to make cards behave more similarly regardless of width
		const squareWidth = Math.max(cardHeight, cardWidth);

		const xConfidence = Math.min(Math.abs(xOffset) / ((cardWidth + squareWidth) / 3.6), 1);
		const yConfidence = Math.min(Math.abs(yOffset) / cardHeight, 1);

		return Math.max(xConfidence, yConfidence);
	}
});

stack.on('throwoutright', onSwipeRight);
stack.on('throwoutleft', onSwipeLeft);

// Add swipability to last card (one that's above others in DOM)
function setupCard() {
	currentCard = document.querySelector('.center-contents .image');
	stack.createCard(currentCard);
}

/**
 * Handle swiping and buttons
 */
function onSwipeRight() {
	handleVote(currentCard.id, 1);
	removeCard(currentCard);
}

function onSwipeLeft() {
	handleVote(currentCard.id, -1);
	removeCard(currentCard);
}

function onClick(isYes, buttonsContainer) {
	handleVote(currentCard.id, isYes);
	animateCard(currentCard, isYes);
	
	// Disable buttons while animating card. 
	// Prevent user from clicking too quickly.
	buttonsContainer.classList.add('buttons--disabled');
	setTimeout(() => {
		setTimeout(() => buttonsContainer.classList.remove('buttons--disabled'), 100);
		removeCard(currentCard);
	}, 300);
}


function handleVote(htmlId, isYes) {

	const mammal = window.mammals.find(mammal => mammal.html_id === htmlId),
		vote = isYes ? 1 : -1;

	// Update mammal object
	mammal.vote = vote;

	// Add vote to queue to save to server
	voteQueue.push({ mammalId: mammal.id, vote });

	// Send votes to the server every 3 seconds or so
	clearTimeout(voteTimeout);
	voteTimeout = setTimeout(recordVotes, 3000);

}

function recordVotes() {

	if ( ! voteQueue.length ) return;

	const url = 'http://api.micahjon.com/any-mammals-milk/vote.php',
		sentVotes = voteQueue.splice(0),
		data = '?data=' + JSON.stringify({ 
			userId: window.userId,
			votes: sentVotes
		});

	getJSON(url + data)
		.then(data => {
			console.log(`Recorded ${sentVotes.length} votes`, data);
		})
		.catch(error => {
			console.log('Failed to record votes'); 
			console.error(error);

			// Add unrecorded votes back on to the queue
			voteQueue.splice(0, 0, ...sentVotes);
		});
}


function animateCard(cardElem, isYes) {

	const sign = isYes ? 1 : -1;

	cardElem.style.transition = 'all .3s ease-out'
	cardElem.style.opacity = '0'
	cardElem.style.transformOrigin = 'transform-origin: 50% 90%;'
	cardElem.style.transform = `rotate(40deg) translateY(${-800 * sign}px) translateX(${200 * sign}px)`;
	
}

// Remove existing card once it move off-screen, and add a new one
function removeCard(cardElem) {
	setTimeout(() => {
		// Remove event handlers from card
		stack.getCard(cardElem).destroy();
		
		// Update state.mammals to add a new card
		cardElem.parentElement.parentElement.dispatchEvent(new Event(mammalSwipeEvent));

	}, 0);
}

// Get first 3 mammals with loaded images that have yet to be swiped
function getUnswipedMammals() {

	// Get unswiped mammals
	let mammals = window.mammals.filter(m => ! m.hasOwnProperty('vote') && ! m.image_not_loaded);
	
	return new Promise((resolve) => {

		resolve(mammals.slice(0,2));

	});
}

//--

function getMammals() {

	if ( window.mammals ) {
		this.updateMammmals(window.mammals);
		return;
	}

	fetch('/full.min.json')
		.then(r => r.json())
		.then(mammals => {
			
			mammals = mammals
				// Only display mammals w/ images
				// Generate full image urls
				.map(m => {
					m.image = '/mammals/' + m.image;

					// Escape single quotes and parenthesis for background images
					m.image = m.image.replace(/['()]/g, "\\$&");

					return m;
				})
				// Add HTML-friendly id
				.map((m, index) => {
					m.html_id = `m_${index}_${m.id.toLowerCase().replace(/[^a-z]/g, '')}`;
					return m;
				});

			// Shuffle mammals
			mammals = shuffle(mammals);

			console.log('Loaded', mammals.length, 'mammals');

			// mammals = mammals.slice(37);

			window.mammals = mammals;

			this.updateMammmals();
		})
		.catch(err => {
			console.error('Unable to fetch mammals', err)
		});
}

function handleAuth() {

	// Don't force re-authentication if user has already been logged in
	// in a prior session on this computer
	const cachedUser = lscache.get('user');
	if ( cachedUser && cachedUser.id ) {

		this.setUser(cachedUser, false);
	}

	window.onAuthReady.then(() => {

		this.webAuth = new auth0.WebAuth({
			domain: 'any-mammals-milk.auth0.com',
			clientID: '8kL5tAS66BwF7gphZQURQwwGR720ofy5',
			responseType: 'token id_token',
			audience: 'https://any-mammals-milk.auth0.com/userinfo',
			scope: 'openid profile email',
			redirectUri: window.location.href
		});

		// If user is coming from Auth0 authentication redirect, log them in
		this.webAuth.parseHash((err, authResult) => {
			if ( authResult && authResult.accessToken && authResult.idTokenPayload ) {

				// Remove hash in URL 
				window.location.hash = '';
				
				// Update UI w/ user data
				const userData = authResult.idTokenPayload;
				const user = { 
					id: userData.sub,
					email: userData.email,
					lastName: userData.family_name,
					firstName: userData.given_name,
					gender: userData.gender,
					picture: userData.picture,
				};

				this.setUser(user);

				return;
			} 
			// Unable to authenticate for some reason
			if (err) { console.error(err); }
		});

	});	
}

//-- 

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function getJSON(url, callback) {
	
	return new Promise((resolve, reject) => {

		var request = new XMLHttpRequest();
		
		request.onload = function() {
			if (this.status >= 200 && this.status < 400) {
				// Success!
				const data = JSON.parse(this.response);
				resolve(data);
			} 
			else {
				// We reached our target server, but it returned an error
				reject(`Server error #${this.status}`);
			}
		};

		request.onerror = request.onabort = () => reject('Request failed');

		request.open('GET', url, true);
		request.send();

	});
}


window.onbeforeunload = recordVotes;

window.addEventListener("resize", debounce(calculateDimensions, 100), false);
function calculateDimensions() {
	windowWidth = window.innerWidth;
}

</script>