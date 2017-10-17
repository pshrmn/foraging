import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@curi/react';

import { NegButton } from 'components/common/Buttons';
import { closeForager } from 'actions';
import MessageBoard from 'components/MessageBoard';

/* eslint-disable no-process-env */
const DEBUG = process.env.NODE_ENV !== 'production';
/* eslint-enable no-process-env */

const logoSrc = chrome.runtime.getURL('/img/home-icon.png');

const TopBar = ({ response, children, closeForager } ) => {
  const pathname = response
    ? response.location.pathname
    : 'loading...';
  return (
    <div className='topbar'>
      <div className='controls'>
        <div className='page-controls'>
          <Link to='Home' anchor='button' className='home'>
            <img src={logoSrc} />orager
          </Link>
          {children}
        </div>
        <div className='app-controls'>
          <NegButton
            classes={['transparent']}
            click={() => {
              document.body.classList.remove('foraging');
              document.body.style.marginTop = 0;
              closeForager();
            }}
          >
            {String.fromCharCode(215)}
          </NegButton>
        </div>
      </div>
      <MessageBoard />
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
  children: PropTypes.any,
  closeForager: PropTypes.func
};

export default connect(
  state => ({ response: state.response }),
  {
    closeForager
  }
)(TopBar);
