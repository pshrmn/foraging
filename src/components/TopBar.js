import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@curi/react';

/* eslint-disable no-process-env */
const DEBUG = process.env.NODE_ENV !== 'production';
/* eslint-enable no-process-env */

const TopBar = ({ response, children } ) => {
  const pathname = response
    ? response.location.pathname
    : 'loading...';
  return (
    <div className='topbar'>
      <Link to='Home' anchor='button'>Forager</Link>
      {children}
      {DEBUG
        ? <div className='address-bar'>
          {pathname}
        </div>
        : null
      }
    </div>
  );
};

TopBar.propTypes = {
  response: PropTypes.object,
  children: PropTypes.any
};

export default connect(
  state => ({ response: state.response })
)(TopBar);
