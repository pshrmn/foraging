import React from 'react';

import Controls from 'components/common/StepControls';
import SingleForm from 'components/forms/SingleForm';

import { select, count } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { currentSelector } from 'constants/CSSClasses';

function initialIndex(props) {
  const { extraData, endData = {} } = props;
  let index = 0;
  // if there is an existing index, only use it if the types match
  if ( endData.spec && endData.spec.index !== undefined ) {
    index = endData.spec.index;
  } else if ( extraData.originalSpec && extraData.originalSpec.index !== undefined ) {
    index = extraData.originalSpec.index;
  }
  return index;
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
    const { index, error } = this.state;
    const { startData, extraData } = this.props;
    const { selector } = startData;
    const { parent = {} } = extraData
    const { matches = [document] } = parent;

    const indices = count(matches, selector);
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
    const { startData, extraData } = this.props;

    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;

    const { index } = this.state;

    const elements = select(
      parentMatches,
      startData.selector,
      {type: 'single', index},
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  }

  componentWillUpdate(nextProps, nextState) {
    unhighlight(currentSelector);

    const { startData, extraData } = nextProps;

    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;

    const { index } = nextState;

    const elements = select(
      parentMatches,
      startData.selector,
      {type: 'single', index},
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
  }
}

export default SingleValueStep;
