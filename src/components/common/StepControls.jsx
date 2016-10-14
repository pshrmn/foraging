import React from 'react';

import { PosButton, NegButton } from 'components/common/Buttons';

/*
 * Controls are a set of buttons used by frames to either:
 *  1. advance to the next step
 *  2. go back to the previous step
 *  3. cancel out of the current cycle of steps
 */
export default function Controls(props) {
  const {
    previous,
    next,
    nextText = 'Next',
    cancel,
    error = false
  } = props;
  return (
    <div className='buttons'>
      <NegButton text='Previous' click={previous} disabled={previous === undefined} />
      <PosButton text={nextText} type='submit' click={next} disabled={error} />
      <NegButton text='Cancel' click={cancel} />
    </div>
  );
}

Controls.propTypes = {
  previous: React.PropTypes.func,
  next: React.PropTypes.func,
  cancel: React.PropTypes.func,
  nextText: React.PropTypes.string,
  error: React.PropTypes.bool
};
