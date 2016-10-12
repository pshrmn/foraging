import React from 'react';

import Controls from 'components/common/StepControls';
import SingleForm from 'components/forms/SingleForm';

import { select, count } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { queryCheck } from 'constants/CSSClasses';

function initialIndex(props) {
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

function highlightElements(props, state) {
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
  highlight(elements, queryCheck);
}

class SingleValueStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: initialIndex(props),
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
    const { startData, next } = this.props;
    if ( error ) {
      return;
    }
    const newSpec = {
      type: 'single',
      index
    }
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
    highlightElements(this.props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    unhighlight(queryCheck);
    highlightElements(nextProps, nextState);
  }

  componentWillUnmount() {
    unhighlight(queryCheck);
  }
}

SingleValueStep.propTypes = {
  startData: React.PropTypes.object,
  endData: React.PropTypes.object,
  staticData: React.PropTypes.object,
  next: React.PropTypes.func,
  previous: React.PropTypes.func
};

export default SingleValueStep;
