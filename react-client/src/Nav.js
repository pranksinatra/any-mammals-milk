import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import bottle from './svg/bottle.svg';
import barGraph from './svg/bar-graph.svg';
import swipe from './svg/swipe.svg';
import caret from './svg/caret.svg';
import { withRouter } from 'react-router-dom';
import { getUserImage, getUserNickname } from './lib/user';

const hideIconsWidth = 400;

const StyledNav = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(170, 30, 30, 0.1);
  font-weight: 300;
  padding: 0 1em;
  @media (max-width: 480px) {
    font-size: 14px;
    padding: 0 0.5em;
  }

  #site-title {
    font-size: inherit;
    margin: 0 auto 0 0;
    font-weight: 300;
    padding: 0;
    white-space: nowrap;
  }
`;

const StyledLink = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  height: 3.5rem;
  line-height: 3.5rem;
  padding: 0 0.5em;
  text-decoration: none;
  color: inherit;
`;

const Icon = styled('img')`
  width: 1.5rem;
  display: inline-block;
  vertical-align: middle;
  margin: 0 2px 0 0;
  @media (max-width: ${hideIconsWidth}px) {
    display: none;
  }
`;

const Circle = styled('div')`
  text-align: center;
  height: 2rem;
  line-height: 2rem;
  width: 2rem;
  border-radius: 50%;
  background-color: rgb(0, 123, 255);
  color: white;
  background-size: contain;
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

const Nav = props => {
  const userImageSrc = getUserImage();
  return (
    <StyledNav>
      <StyledLink id="site-title" to="/">
        <Icon src={bottle} alt="" />
        Any mammal's milk
      </StyledLink>
      <StyledLink to="/">
        <Icon src={swipe} alt="" />
        Swipe
        {'/' === props.location.pathname && <ActiveLine />}
      </StyledLink>
      <StyledLink to="/metrics/">
        <Icon src={barGraph} alt="" style={{ margin: '0 6px 0 0' }} />
        Metrics
        {'/metrics/' === props.location.pathname && <ActiveLine />}
      </StyledLink>
      <StyledLink to="/profile/" title="Your Profile">
        <Circle
          style={{
            backgroundImage: userImageSrc ? `url(${userImageSrc})` : '',
          }}
        >
          {userImageSrc ? '' : getUserNickname().charAt(0) || '?'}
        </Circle>
        <Icon src={caret} alt="" style={{ width: '8px', marginLeft: '6px' }} />
        {'/profile/' === props.location.pathname && <ActiveLine />}
      </StyledLink>
    </StyledNav>
  );
};

export default withRouter(Nav);
