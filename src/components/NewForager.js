import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Controls from 'components/Controls';

const Forager = ({ show, response }) => {
  const { body:Body } = response;
  return (
    !show ? null : (
      <div id='forager'>
        <Controls />
        <Body />
      </div>
    )
  );
};

Forager.propTypes = {
  show: PropTypes.bool.isRequired,
  response: PropTypes.shape({
    body: PropTypes.any.isRequired
  })
};

export default connect(
  state => ({
    show: state.show
  })
)(Forager);
