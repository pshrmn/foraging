import React from 'react';

import { PosButton, NegButton } from '../../common/Buttons';

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
