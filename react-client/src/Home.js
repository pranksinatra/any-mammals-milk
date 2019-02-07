import React from 'react';
import Nav from './Nav';
import Footer from './Footer';
import Swipe from './Swipe';
import { api } from './lib/api';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mammals: [],
    };
    this.handleVote = this.handleVote.bind(this);
  }

  componentDidMount() {
    api
      .getMammals()
      .then(mammals => {
        this.setState({ mammals });
      })
      .catch(error => {
        console.log('Unable to fetch mammals!', error);
      });
  }

  handleVote(mammal, vote) {
    console.log('Voted for mammal', mammal.htmlId, vote);
    this.setState({
      mammals: this.state.mammals.map(thisMammal => {
        if (thisMammal === mammal) thisMammal.vote = vote ? 1 : -1;
        return thisMammal;
      }),
    });
  }

  render() {
    return (
      <div>
        <Nav />
        <main>
          <Swipe mammals={this.state.mammals} onVote={this.handleVote} />
        </main>
        <Footer />
      </div>
    );
  }
}

export default Home;
