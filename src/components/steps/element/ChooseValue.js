import React from 'react';
import PropTypes from 'prop-types';

import { CreateAllValueStep, EditAllValueStep } from './AllValueStep';
import { CreateSingleValueStep, EditSingleValueStep } from './SingleValueStep';
import { CreateRangeValueStep, EditRangeValueStep } from './RangeValueStep';

export function CreateValue(props) {
  const { spec } = props.startData;
  switch ( spec.type ) {
  case 'all':
    return <CreateAllValueStep {...props} />;
  case 'single':
    return <CreateSingleValueStep {...props} />;
  case 'range':
    return <CreateRangeValueStep {...props} />;
  default:
    return null;
  }
}

export function EditValue(props) {
  const { spec } = props.startData;
  switch ( spec.type ) {
  case 'all':
    return <EditAllValueStep {...props} />;
  case 'single':
    return <EditSingleValueStep {...props} />;
  case 'range':
    return <EditRangeValueStep {...props} />;
  default:
    return null;
  }
}

CreateValue.propTypes = {
  startData: PropTypes.object.isRequired
};

EditValue.propTypes = {
  startData: PropTypes.object.isRequired
};
