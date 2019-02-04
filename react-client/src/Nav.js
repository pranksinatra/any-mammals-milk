import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import bottle from './svg/bottle.svg';
import barGraph from './svg/bar-graph.svg';
import swipe from './svg/swipe.svg';
import { withRouter } from 'react-router-dom';

const StyledNav = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(170, 30, 30, 0.1);
  font-weight: 300;
  padding: 0 1em;
  @media (max-width: 370px) {
    #swipe-icon,
    #metrics-icon {
      display: none;
    }
  }
  @media (max-width: 425px) {
    font-size: 14px;
    padding: 0 0.5em;
  }
  img {
    width: 1.5rem;
    display: inline-block;
    vertical-align: middle;
    margin: -6px 2px 0 0;
  }

  #site-title {
    font-size: inherit;
    line-height: 3.5;
    margin-bottom: 0;
    font-weight: 300;
    padding: 0;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    display: block;
    float: left;
  }

  #metrics-icon {
    padding: 0 4px;
  }

  .selected {
    position: relative;
    display: inline-block;
  }

  .selected::after {
    position: absolute;
    content: '';
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgb(170, 30, 30);
    display: block;
    bottom: -1px;
  }

  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }
`;

const ActiveLine = styled('span')`
  position: absolute;
  content: '';
  width: calc(100% - 1em);
  height: 2px;
  background-color: rgb(170, 30, 30);
  display: block;
  bottom: -1px;
`;

const StyledLink = styled(Link)`
  position: relative;
  display: inline-block;
`;

const Nav = props => {
  return (
    <StyledNav>
      <StyledLink id="site-title" to="/">
        <img src={bottle} alt="" />
        Any mammal's milk
      </StyledLink>
      <ul>
        <li>
          <StyledLink to="/">
            <img src={swipe} alt="" />
            Swipe
            {'/' === props.location.pathname && <ActiveLine />}
          </StyledLink>
        </li>
        <li>
          <StyledLink to="/metrics/">
            <img src={barGraph} alt="" style={{ margin: '-6px 6px 0 4px' }} />
            Metrics
            {'/metrics/' === props.location.pathname && <ActiveLine />}
          </StyledLink>
        </li>
      </ul>
    </StyledNav>
  );
};

export default withRouter(Nav);
