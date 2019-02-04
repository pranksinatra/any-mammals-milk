import React from 'react';
import styled from '@emotion/styled';
import Nav from './Nav.js';
import Footer from './Footer.js';
import Swipe from './Swipe.js';

class Home extends React.Component {
  render() {
    return (
      <div>
        <Nav />
        <main>
          <Swipe />
        </main>
        <Footer />
      </div>
    );
  }
}

export default Home;
