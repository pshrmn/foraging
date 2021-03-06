import React from 'react';
import PropTypes from 'prop-types';

import { NeutralButton } from 'components/common/Buttons';

/*
 * Given an array of items, a Cycle uses two buttons to
 * allow you to cycle through the items in the array. The
 * Cycle only handles controlling the index that should
 * be shown, not displaying the actual items. A callback
 * is used to let the component in charge of displaying
 * items know the index of the one to show.
 *
 * When incrementing, automatically returns to 0 when end of
 * list has been reached. When decrementing, automatically
 * jumps to end of list after 0.
 */
const Cycle = ({ index, count, setIndex }) => {
  const nextIndex = (index+1) % count;
  const prevIndex = ((index-1) + count) % count;
  return (
    <div className='cycle'>
      <NeutralButton
        click={() => { setIndex(prevIndex); }}
      >
        {'<'}
      </NeutralButton>
      {index + 1} / {count}
      <NeutralButton
        click={() => { setIndex(nextIndex); }}
      >
        {'>'}
      </NeutralButton>
    </div>
  );
};

Cycle.propTypes = {
  index: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  setIndex: PropTypes.func
};

export default Cycle;
