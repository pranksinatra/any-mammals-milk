<Nav page={{page}}></Nav>

<main>

	<h1>Would you drink this mammal's milk?</h1>

	<Swipe mammals={{mammalsToSwipe}} votingEnabled={{ !! user }} on:vote="onVote(event.vote)" on:login="login()"></Swipe>

</main>

<Footer></Footer>

<script>
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import Swipe from '../../components/Swipe';
import roadtrip from 'roadtrip';
import lscache from 'lscache';
import { auth } from '../../lib/auth';
import { api } from '../../lib/api';
import { utils } from '../../lib/utils';
import { mammals } from '../../lib/mammals';

export default {
	components: {
		Nav,
		Swipe,
		Footer,
	},
	// Setup initial data for app
	data() {
		return {
			mammals: [],
			mammalsToSwipe: [],
			user: null,
		};
	},
	// Get list of mammals and current user data
	oncreate() {

		mammals
			.getMammals()
			.then(mammals => {
				this.set({ mammals });
				this.updateMammmals();
			})
			.catch(err => {
				console.log('Unable to fetch mammals:');
				console.error(err);
			});

		// //--

		this.updateUser = this.updateUser.bind(this);

		auth
			.getUser()
			.then(this.updateUser)
			.catch(err => console.log(err));

		auth.addUpdateListener(this.updateUser);
	},

	ondestroy() {
		auth.removeUpdateListener(this.updateUser);
	},
	
	methods: {
		goto(path) {
			roadtrip.goto(path);
		},
		onVote(vote) {
			const mammal = this.get('mammalsToSwipe')[0];
			mammal.vote = vote;
			api.recordVote({
				userId: this.get('user').id,
				mammalId: mammal.id,
				vote,
			});
			this.updateMammmals();
		},
		updateMammmals() {
			this.set({
				mammalsToSwipe: this.get('mammals')
					.filter(mammal => !mammal.hasOwnProperty('vote'))
					.slice(0, 2),
			});
		},
		updateUser(user) {
			this.set({ user });
			
			if ( window.userId === user.id ) return;
			window.userId = user.id;

			api
				.getUserVotes(user.id)
				.then(votes => {

					const voteCount = Object.keys(votes).length;
					console.log(`Got ${voteCount} votes`);

					if (!voteCount) return;

					this.get('mammals').forEach(mammal => {
						if (votes.hasOwnProperty(mammal.id)) {
							mammal.vote = votes[mammal.id];
						}
					});

					this.updateMammmals();
				})
				.catch(err => {
					console.error(err);
				});
		},
		login() {
			auth.login();
		},
		newsletterSignup(event) {
			event.preventDefault();

			console.log(event);

			// console.log(data);
		},
	},
	events: {},
	helpers: {},
	computed: {},
};

</script>

<style>

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