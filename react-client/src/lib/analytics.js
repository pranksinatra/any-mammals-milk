import ReactGA from 'react-ga';
import React, { useEffect } from 'react';

const dev = process.env.NODE_ENV !== 'production';
if (!dev) {
  ReactGA.initialize('UA-114826322-1');
}

// Track page views in Google Analytics
// @source https://github.com/react-ga/react-ga/wiki/React-Router-v4-withTracker

ReactGA.initialize('UA-114826322-1');

const withAnalytics = WrappedComponent => {
  // Track page in Google Analytics
  const trackPage = page => {
    if (!dev) {
      ReactGA.set({ page });
      ReactGA.pageview(page);
    } else {
      console.log('Not tracking page on dev:', page);
    }
  };

  // Track again whenever page path changes
  return props => {
    useEffect(() => trackPage(props.location.pathname), [
      props.location.pathname,
    ]);

    return <WrappedComponent {...props} />;
  };
};

export default withAnalytics;
