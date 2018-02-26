<Nav page={{page}}></Nav>

<main>

	<h1>Metrics</h1>

	<p style="text-align: center;">We are building a dataset of the most coveted mammals' milk.</p>

	<br><br>

	<h2>Most Upvoted:</h2>

	<p>One might say, <em>la crème de la crème.</em></p>

	<div class="upvoted-chart ct-chart ct-golden-section" ref:chart1></div>

	<br>

	<h2>Most Downvoted:</h2>

	<p>(we're probably not going to milk these mammals)</p>

	<div class="downvoted-chart ct-chart ct-golden-section" ref:chart2></div>

	<br><br><br><br><br>

	<p style="text-align: center">Don't know what to do next? <a href="/">Keep swiping!</a></p>

	<br><br><br><br><br><br>

</main>

<Footer></Footer>

<script>
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import Chartist from 'chartist';
import { mammals } from '../../lib/mammals';
import { utils } from '../../lib/utils';

export default {
	components: {
		Nav, Footer
	},
	oncreate() {

		mammals.getMammals()
		.then(mammals => {
			this.set({ mammals });
		})
		.then(() => {
			return mammals.getVotesByMammal();
		})
		.then(votesByMammal => {
			// Convert votes from id: [yes, no] to nicer object format

			const mammals = this.get('mammals');

			votesByMammal = Object.keys(votesByMammal).map(mammalId => {
				return { 
					id: mammalId, 
					yes: parseInt(votesByMammal[mammalId][0], 10), 
					no: parseInt(votesByMammal[mammalId][1], 10),
					data: mammals.find(mammal => mammal.id === mammalId),
				};
			});

			const count = 7,
				topMammals = votesByMammal.slice().sort((a,b) => a.yes > b.yes ? -1 : 1).slice(0, count),
				bottomMammals = votesByMammal.slice().sort((a,b) => a.no > b.no ? -1 : 1).slice(0, count);
			
			const topData = { labels: [], series: [ [], [] ] },
				bottomData = { labels: [], series: [ [], [] ] };

			topMammals.forEach(({ id, data, yes, no }) => {
				topData.labels.push( data && data.name || id );
				topData.series[0].push(yes);
				// topData.series[1].push(no);
			});

			bottomMammals.forEach(({ id, data, yes, no }) => {
				bottomData.labels.push( data && data.name || id );
				// bottomData.series[0].push(yes);
				bottomData.series[1].push(no);
			});

			// Build charts
			createBarChart(this.refs.chart1, topData);
			createBarChart(this.refs.chart2, bottomData);

		}) 
		.catch(err => {
			console.error(err);
		})
	}
}

function createBarChart(chartContainer, data) {
	new Chartist.Bar(chartContainer, data, {
		seriesBarDistance: 10,
		reverseData: true,
		horizontalBars: true,
		axisY: {
			offset: 80,
		},
		axisX: {
			onlyInteger: true
		}
	});
}
</script>


<style>
.ct-label {
	color: #666;
	font-family: inherit;
}
.upvoted-chart line {
	stroke: green;
}
@media (max-width: 500px) {
	.ct-golden-section:before {
		padding-bottom: 80%;
	}
}
@media (max-width: 400px) {
	.ct-golden-section:before {
		padding-bottom: 100%;
	}
}
p {
	color: #999;
	font-weight: 300;
}
</style>