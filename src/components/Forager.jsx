import React from 'react';
import { connect } from 'react-redux';

import Controls from 'components/Controls';
import Frames from 'components/frames/Frames';

function Forager(props) {
  return !props.show ? null :
    (
      <div id='forager'>
        <Controls />
        <Frames />
      </div>
    );  
}

export default connect(
  state => ({
    show: state.show
  })
)(Forager);
