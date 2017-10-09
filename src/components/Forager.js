import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TopBar from 'components/TopBar';

const Forager = ({ show, response }) => {
  const { body, data } = response;
  const { main:Main, controls:Controls} = body;
  return (
    !show ? null : (
      <div id='forager'>
        <TopBar>
          <Controls data={data} />
        </TopBar>
        <Main data={data} />
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
    show: state.show,
    response: state.response
  })
)(Forager);
