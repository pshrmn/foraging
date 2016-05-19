import React from 'react'

import { NeutralButton } from '../../common/Buttons';

export default function Cycle(props) {
  const { index, count, setIndex } = props;
  const nextIndex = (index+1) % count;
  const prevIndex = ((index-1) + count) % count;
  return (
    <div>
      <NeutralButton
        click={() => { setIndex(prevIndex); }}
        text='<' />
      {index + 1} / {count}
      <NeutralButton
        click={() => { setIndex(nextIndex); }}
        text='>' />
    </div>
  );
}
