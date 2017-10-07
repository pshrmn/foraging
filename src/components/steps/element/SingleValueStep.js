import React from 'react';
import PropTypes from 'prop-types';

import Controls from 'components/common/StepControls';
import SingleForm from 'components/forms/SingleForm';

import { select, count } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { queryCheck, currentSelector } from 'constants/CSSClasses';

class SingleValueStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: props.setupState(props),
      error: false
    };

    this.indexHandler = this.indexHandler.bind(this);
    this.nextHandler = this.nextHandler.bind(this);
    this.previousHandler = this.previousHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }

  indexHandler(event) {
    const { value } = event.target;
    this.setState({
      index: parseInt(value, 10),
      error: false
    });
  }

  nextHandler(event) {
    event.preventDefault();
    const { index, error } = this.state;
    const { startData, next, validate } = this.props;
    if ( error ) {
      return;
    }
    const ok = validate(this.props, this.state);
    if ( !ok ) {
      return;
    }
    const newSpec = { type: 'single', index };
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
    const { index, error } = this.state;
    const { startData, staticData } = this.props;
    const { selector } = startData;
    const { parent } = staticData;

    const indices = count(parent.matches, selector);

    return (
      <form className='info-box'>
        <div className='info'>
          <SingleForm index={index} count={indices} setIndex={this.indexHandler} />
        </div>
        <Controls
          previous={this.previousHandler}
          next={this.nextHandler}
          cancel={this.cancelHandler}
          error={error} />
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

SingleValueStep.propTypes = {
  startData: PropTypes.object,
  endData: PropTypes.object,
  staticData: PropTypes.object,
  next: PropTypes.func,
  previous: PropTypes.func,
  cancel: PropTypes.func,
  setupState: PropTypes.func,
  validate: PropTypes.func,
  highlightClass: PropTypes.string
};

export const CreateSingleValueStep = props => (
  <SingleValueStep
    setupState={initialCreateIndex}
    highlightClass={queryCheck}
    validate={() => true}
    {...props} />
);

export const EditSingleValueStep = props => (
  <SingleValueStep
    setupState={initialEditIndex}
    highlightClass={currentSelector}
    validate={() => true}
    {...props} />
);


function initialCreateIndex(props) {
  const { startData, endData = {} } = props;
  let index = 0;
  // if there is an existing value, only use it if the types match
  if ( endData.spec && endData.spec.index !== undefined ) {
    index = endData.spec.index;
  } else if ( startData.spec && startData.spec.index !== undefined ) {
    index = startData.spec.index;
  }
  return index;
}

function initialEditIndex(props) {
  const { staticData, endData = {} } = props;
  let index = 0;
  // if there is an existing index, only use it if the types match
  if ( endData.spec && endData.spec.index !== undefined ) {
    index = endData.spec.index;
  } else if ( staticData.originalSpec && staticData.originalSpec.index !== undefined ) {
    index = staticData.originalSpec.index;
  }
  return index;
}

function highlightElements(props, state, highlightClass) {
  const { startData, staticData } = props;
  const { index } = state;

  const { selector } = startData;
  const { parent } = staticData;

  const elements = select(
    parent.matches,
    selector,
    {type: 'single', index},
    '.forager-holder'
  );
  highlight(elements, highlightClass);
}
