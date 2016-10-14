import React from 'react';
import { connect } from 'react-redux';

import Controls from 'components/Controls';
import Frames from 'components/frames/Frames';

const Forager = ({ show }) => (
  !show ? null : (
    <div id='forager'>
      <Controls />
      <Frames />
    </div>
  )
);

Forager.propTypes = {
  show: React.PropTypes.bool.isRequired
};

export default connect(
  state => ({
    show: state.show
  })
)(Forager);
