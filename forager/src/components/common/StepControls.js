import React from 'react';
import PropTypes from 'prop-types';

import { PosButton, NegButton } from 'components/common/Buttons';

/*
 * Controls are a set of buttons used to either:
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
    error = false,
    children
  } = props;
  return (
    <div className='buttons'>
      <NegButton
        type='button'
        click={previous}
        disabled={previous === undefined}
      >
        Previous
      </NegButton>
      <PosButton
        type='submit'
        click={next}
        disabled={error}
      >
        {nextText}
      </PosButton>
      <NegButton
        type='button'
        click={cancel}
      >
        Cancel
      </NegButton>
      { children }
    </div>
  );
}

Controls.propTypes = {
  previous: PropTypes.func,
  next: PropTypes.func,
  cancel: PropTypes.func,
  nextText: PropTypes.string,
  error: PropTypes.bool,
  children: PropTypes.any
};
