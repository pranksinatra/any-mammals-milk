import ReactGA from 'react-ga';
import React from 'react';

const dev = process.env.NODE_ENV !== 'production';
if (!dev) {
  ReactGA.initialize('UA-114826322-1');
}

// Track page views in Google Analytics
// @source https://github.com/react-ga/react-ga/issues/122#issuecomment-396087073

ReactGA.initialize('UA-114826322-1');

export default Component =>
  class WithAnalytics extends React.Component {
    componentDidMount() {
      const page = this.props.location.pathname;
      this.trackPage(page);
    }

    componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname;
      const nextPage = nextProps.location.pathname;
      if (currentPage !== nextPage) this.trackPage(nextPage);
    }

    trackPage = page => {
      if (!dev) {
        ReactGA.set({ page });
        ReactGA.pageview(page);
      } else {
        console.log('Not tracking page on dev:', page);
      }
    };

    render() {
      return <Component {...this.props} />;
    }
  };
