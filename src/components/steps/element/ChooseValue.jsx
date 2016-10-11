import React from 'react';

import AllValueStep from './AllValueStep';
import SingleValueStep from './SingleValueStep';
import RangeValueStep from './RangeValueStep';

export default function ChooseValue(props) {
  const { spec } = props.startData;
  switch ( spec.type ) {
  case 'all':
    return <AllValueStep {...props} />;
  case 'single':
    return <SingleValueStep {...props} />;
  case 'range':
    return <RangeValueStep {...props} />;
  default:
    return null;
  }
}
