import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AddressBar from 'components/AddressBar';

const Forager = ({ show, response }) => {
  const { body:Body, params } = response;
  return (
    !show ? null : (
      <div id='forager'>
        <AddressBar />
        <Body params={params} />
      </div>
    )
  );
};

Forager.propTypes = {
  show: PropTypes.bool.isRequired,
  response: PropTypes.shape({
    body: PropTypes.any.isRequired,
    params: PropTypes.object
  })
};

export default connect(
  state => ({
    show: state.show
  })
)(Forager);
