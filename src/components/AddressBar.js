import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@curi/react';

const AddressBar = ({ response } ) => {
  const pathname = response
    ? response.location.pathname
    : 'loading...';
  return (
    <div className='address-bar'>
      <Link to='Home'>Forager</Link>
      {pathname}
    </div>
  );
};

AddressBar.propTypes = {
  response: PropTypes.object
};

export default connect(
  state => ({ response: state.response })
)(AddressBar);
