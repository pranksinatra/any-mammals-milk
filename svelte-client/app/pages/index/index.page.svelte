<Nav page={{page}}></Nav>

<main>

	<h1>Would <u>you</u> drink this mammals milk?</h1>

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

		<div id="buttons" class="buttons">
			{{#if user }}
			<button class="button--yes" on:click="onClick(true)">Yup!</button>
			<button class="button--no" on:click="onClick(false)">Ewww!</button>
			{{else}}
			<button class="button--login" on:click="login()">Log in to vote on mammals!</button>
			{{/if}}
		</div>

	</div>

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
	left: 1rem;
	width: 4.75em;
	background-color: rgb(220, 53, 69);
}
.button--no:hover {
	background-color: rgb(200, 35, 51);
}
.button--no:focus {
	box-shadow: 0 0 0 .2em rgba(220, 53, 69, 0.5);
}

.button--yes {
	right: 1rem;
	width: 4.75em;
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

</style>

<script>
import roadtrip from 'roadtrip';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import * as swing from 'swing';

const mammalSwipeEvent = 'mammalSwipe';
const loadedImages = [];

let currentCard = null;
let buttonsContainer = null;
setTimeout(() => {
	buttonsContainer = document.getElementById('buttons');
}, 0);

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
				const testUserId = 'test-user|' + Math.round(Math.random() * 1000000);
				this.set({ 
					user: { id: testUserId } 
				});
				return;
			}
			// Take user to external login page, then redirect back here on 
			// successful login
			window.onAuthReady.then(() => this.webAuth.authorize());
		},
		onClick,
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

// //--

/**
 * Setup swipable card stack
 */
let windowWidth = window.innerWidth;
const stack = swing.Stack({
	allowedDirections: [ swing.Direction.LEFT, swing.Direction.RIGHT ],
	throwOutDistance: () => Math.max(windowWidth) / 4 + 200,
	// Make it easier to swipe left or right on a card
	throwOutConfidence: (xOffset, yOffset, element) => {
		const xConfidence = Math.min(Math.abs(xOffset) / (element.offsetWidth / 1.75), 1);
		const yConfidence = Math.min(Math.abs(yOffset) / element.offsetHeight, 1);
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

function onClick(isYes) {
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

// Update mammal object
function handleVote(htmlId, isYes) {
	window.mammals.find(mammal => mammal.html_id === htmlId).vote = isYes ? 1 : -1;
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

	fetch('/full.json')
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

	window.onAuthReady.then(() => {

		this.webAuth = new auth0.WebAuth({
			domain: 'any-mammals-milk.auth0.com',
			clientID: '8kL5tAS66BwF7gphZQURQwwGR720ofy5',
			responseType: 'token id_token',
			audience: 'https://any-mammals-milk.auth0.com/userinfo',
			scope: 'openid',
			redirectUri: window.location.href
		});

		// If user is coming from Auth0 authentication redirect, log them in
		this.webAuth.parseHash((err, authResult) => {
			if ( authResult && authResult.accessToken && authResult.idToken ) {
				window.location.hash = '';
				this.set({
					user: { id: authResult.idTokenPayload.sub }
				});
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

window.addEventListener("resize", debounce(calculateDimensions, 100), false);
function calculateDimensions() {
	windowWidth = window.innerWidth;
}

</script>