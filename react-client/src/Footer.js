import React from 'react';
import styled from '@emotion/styled';

const StyledFooter = styled('div')`
  background-color: #f5f5f5;
  padding: 1rem;
  .footer-content {
    text-align: center;
    font-size: 12px;
    color: #666;
    margin: 2rem auto;
  }
  a {
    color: inherit;
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <div className="footer-content">
        <p className="icon-attribution">
          Icons made by{' '}
          <a
            href="http://www.freepik.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Freepik
          </a>{' '}
          and{' '}
          <a
            href="https://www.flaticon.com/authors/pixel-perfect"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pixel perfect
          </a>{' '}
          from{' '}
          <a
            href="https://www.flaticon.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            flaticon.com
          </a>{' '}
          is licensed by{' '}
          <a
            href="http://creativecommons.org/licenses/by/3.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC&nbsp;3.0&nbsp;BY
          </a>
        </p>
        <p>
          Copyright © {new Date().getFullYear()} Jacob Maldonado Nofziger &amp;
          Micah Miller-Eshleman
        </p>
      </div>
    </StyledFooter>
  );
};

export default Footer;
