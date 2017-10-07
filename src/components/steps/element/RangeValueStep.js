import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Controls from 'components/common/StepControls';
import RangeForm from 'components/forms/RangeForm';

import { select, count } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { takenNames } from 'helpers/store';

import { showMessage } from 'expiring-redux-messages';
import { queryCheck, currentSelector } from 'constants/CSSClasses';

class RangeValueStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.setupState(props);

    this.nameHandler = this.nameHandler.bind(this);
    this.lowHandler = this.lowHandler.bind(this);
    this.highHandler = this.highHandler.bind(this);
    this.nextHandler = this.nextHandler.bind(this);
    this.previousHandler = this.previousHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }

  nameHandler(event) {
    const { value } = event.target;
    this.setState({
      name: value,
      error: value === ''
    });
  }

  lowHandler(event) {
    const { value } = event.target;
    let low = parseInt(value, 10);
    let { high } = this.state;
    if ( low > high ) {
      [high, low] = [low, high];
    }
    this.setState({
      low,
      high
    });
  }

  highHandler(event) {
    const { value } = event.target;
    if ( value === 'end' ) {
      this.setState({
        high: value
      });
      return;
    }
    let high = parseInt(value, 10);
    let { low } = this.state;
    if ( low > high ) {
      [high, low] = [low, high];
    }
    this.setState({
      low,
      high
    });
  }

  nextHandler(event) {
    event.preventDefault();
    const { name, low, high, error } = this.state;
    const {
      startData,
      next,
      showMessage,
      validate
    } = this.props;

    const ok = validate(this.props, this.state);
    if ( !ok ) {
      showMessage(`"${name}" is a duplicate name and cannot be used.`, 5000, -1);
      return;
    }

    if ( error ) {
      return;
    }
    const newSpec = {
      type: 'range',
      name,
      low,
      high: high === 'end'? null : high, // convert 'end' to null
    };
    next(Object.assign({}, startData, { spec: newSpec }));
  }

  previousHandler(event) {
    event.preventDefault();
    this.props.previous();
  }

  cancelHandler(event) {
    event.preventDefault();
    this.props.cancel();
  }

  render() {
    const { name, low, high, error } = this.state;
    const { startData, staticData } = this.props;
    const { selector } = startData;
    const { parent } = staticData;

    const indices = count(parent.matches, selector);

    return (
      <form className='info-box'>
        <div className='info'>
          <RangeForm
            name={name}
            low={low}
            high={high}
            count={indices}
            setName={this.nameHandler}
            setLow={this.lowHandler}
            setHigh={this.highHandler}
          />
        </div>
        <Controls
          previous={this.previousHandler}
          next={this.nextHandler}
          cancel={this.cancelHandler}
          error={error}
        />
      </form>
    );
  }

  componentWillMount() {
    highlightElements(this.props, this.state, this.props.highlightClass);
  }

  componentWillUpdate(nextProps, nextState) {
    unhighlight(this.props.highlightClass);
    highlightElements(nextProps, nextState, this.props.highlightClass);
  }

  componentWillUnmount() {
    unhighlight(this.props.highlightClass);
  }
}

RangeValueStep.propTypes = {
  startData: PropTypes.object,
  endData: PropTypes.object,
  staticData: PropTypes.object,
  next: PropTypes.func,
  previous: PropTypes.func,
  cancel: PropTypes.func,
  setupState: PropTypes.func,
  highlightClass: PropTypes.string,
  validate: PropTypes.func,
  showMessage: PropTypes.func,
  takenNames: PropTypes.array
};

const ConnectedRangeValueStep = connect(
  state => {
    const { page } = state;
    return {
      takenNames: takenNames(page)
    };
  },
  {
    showMessage
  }
)(RangeValueStep);

export const CreateRangeValueStep = props => (
  <ConnectedRangeValueStep
    setupState={initialCreateState}
    highlightClass={queryCheck}
    validate={validateCreate}
    {...props}
  />
);

export const EditRangeValueStep = props => (
  <ConnectedRangeValueStep
    setupState={initialEditState}
    highlightClass={currentSelector}
    validate={validateEdit}
    {...props}
  />
);

function initialCreateState(props) {
  const { startData, endData = {} } = props;
  let name = '';
  let low = 0;
  let high = 'end';

  if ( endData.spec ) {
    if ( endData.spec.name ) {
      name = endData.spec.name;
    }
    if ( endData.spec.low !== undefined) {
      low = endData.spec.low;
    }
    if ( endData.spec.high !== undefined ) {
      high = endData.spec.high === null ? 'end' : endData.spec.high;
    }
  } else if ( startData.spec ) {
    if ( startData.spec.name ) {
      name = startData.spec.name;
    }
    if ( startData.spec.low !== undefined) {
      low = startData.spec.low;
    }
    if ( startData.spec.high !== undefined ) {
      high = startData.spec.high === null ? 'end' : startData.spec.high;
    }
  }

  return {
    name,
    low,
    high,
    error: name === ''
  };
}

function initialEditState(props) {
  const { staticData, endData = {} } = props;
  let name = '';
  let low = 0;
  let high = 'end';
  // if there is an existing value, only use it if the types match
  if ( endData.spec ) {
    const spec = endData.spec;
    if ( spec.name ) {
      name = spec.name;
    }
    if ( spec.low !== undefined) {
      low = spec.low;
    }
    if ( spec.high !== undefined ) {
      high = spec.high === null ? 'end' : spec.high;
    }
  } else if ( staticData.originalSpec ) {
    const spec = staticData.originalSpec;
    if ( spec.name ) {
      name = spec.name;
    }
    if ( spec.low !== undefined) {
      low = spec.low;
    }
    if ( spec.high !== undefined ) {
      high = spec.high === null ? 'end' : spec.high;
    }
  }
  return {
    name,
    low,
    high,
    error: name === ''
  };
}

function validateCreate(props, state) {
  const { name } = state;
  const { takenNames } = props;
  return takenNames.every(n => n !== name);
}

function validateEdit(props, state) {
  const { name } = state;
  const { takenNames, staticData } = props;
  const originalName = staticData.originalSpec.name;
  // name is taken if we're keeping the same name
  return name === originalName || takenNames.every(n => n !== name);
}

function highlightElements(props, state, highlightClass) {
  const { startData, staticData } = props;
  const { name, low } = state;
  let { high } = state;

  const { selector } = startData;
  const { parent } = staticData;
  if ( high === 'end' ) {
    high = null;
  }
  const elements = select(
    parent.matches,
    selector,
    {type: 'range', name, low, high},
    '.forager-holder'
  );
  highlight(elements, highlightClass);
}
