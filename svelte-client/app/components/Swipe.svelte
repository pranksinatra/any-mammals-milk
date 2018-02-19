<div class="{{ votingEnabled ? 'square' : 'square square--no-swiping' }}">
	{{#each mammals as mammal, index @id}}
	<div class="center-contents">
		{{ #if index == 0 }}
		<div ref:currentCard id={{id(mammal.id)}} class="image" style="background-image: url({{ mammal.image }}); max-width: {{ maxWidth(mammal) }}">
			<div class="aspect-ratio" style="padding-bottom: {{ padBot(mammal) }}"></div>
			<div class="caption">
				{{mammal.name}}
			</div>
		</div>
		{{ else }}
		<div id={{id(mammal.id)}} class="image" style="background-image: url({{ mammal.image }}); max-width: {{ maxWidth(mammal) }}">
			<div class="aspect-ratio" style="padding-bottom: {{ padBot(mammal) }}"></div>
			<div class="caption">
				{{mammal.name}}
			</div>
		</div>
		{{ /if }}
	</div>
	{{/each}}

	<div id="buttons" class="{{ clickingEnabled ? 'buttons' : 'buttons buttons--disabled' }}" ref:buttonsContainer>
		{{#if votingEnabled }}
		<button class="button--yes alt-font" on:click="onClick(true)">Yes</button>
		<button class="button--no alt-font" on:click="onClick(false)">No</button>
		{{else}}
		<button class="button--login" on:click="fire('login')">Log in to vote on mammals!</button>
		{{/if}}
	</div>

</div>

<script>
import * as swing from 'swing';
import { utils } from '../lib/utils';

export default {
	oncreate() {
		// Setup card stack
		this.cardStack = setupSwiping.bind(this)();

		this.observe(
			'mammals',
			newValue => {
				if (!newValue.length) return;

				// Setup swiping on first card in stack
				this.cardStack.createCard(this.refs.currentCard);

				// console.log(newValue.map( ({id}) => id ) );
				// console.log(this.refs.currentCard.id);
			},
			{ defer: true }
		);
	},
	data() {
		return {
			mammals: [],
			emptyMessage: 'Fetching mammals...',
			votingEnabled: false,
			clickingEnabled: true,
		};
	},
	methods: {
		onClick(isYes) {
			// Disable buttons while card is animating
			this.set({ clickingEnabled: false });

			// Animate card to simulate swipe
			animateCard(this.refs.currentCard, isYes, () => {
				this.onSwipe(isYes);
				this.set({ clickingEnabled: true });
			});
		},
		onSwipe(isRight) {
			// Remove event listeners from just-swiped card
			this.cardStack.getCard(this.refs.currentCard).destroy();

			// Send vote to parent component
			this.fire('vote', { vote: isRight ? 1 : -1 });
		},
	},
	helpers: {
		padBot({ width, height }) {
			return 100 / width * height + '%';
		},
		// Fit image in 10 x 8 box
		maxWidth({ width, height }) {
			const aspectRatio = width / height,
				boxRatio = 10 / 8;

			return 100 * (aspectRatio > boxRatio ? 1 : width / height / boxRatio) + '%';
		},
		id(words) {
			return words.replace(' ', '-').toLowerCase().replace(/[^a-z-]/g, '');
		}
	},
	computed: {
		squareClass: user => {
			if (!user) return 'square square--no-swiping';
			return 'square';
		},
	},
};

/**
 * Setup swipable card stack
 */
function setupSwiping() {
	const stack = swing.Stack({
		allowedDirections: [swing.Direction.LEFT, swing.Direction.RIGHT],
		throwOutDistance: () => Math.max(utils.windowWidth) / 4 + 200,

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
		},
	});

	stack.on('throwoutright', () => {
		this.onSwipe(true);
	});
	stack.on('throwoutleft', () => {
		this.onSwipe(false);
	});

	return stack;
}

/**
 * Animate a card to the right or left when user clicks Yes or No
 */
function animateCard(cardElem, isRight, callback) {
	const sign = isRight ? 1 : -1;

	const duration = 0.3;

	cardElem.style.transition = `all ${duration}s ease-out`;
	cardElem.style.opacity = '0';
	cardElem.style.transformOrigin = 'transform-origin: 50% 90%;';
	cardElem.style.transform = `rotate(40deg) translateY(${-800 * sign}px) translateX(${200 *
		sign}px)`;

	setTimeout(callback, duration * 1000);
}
</script>

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
</style>