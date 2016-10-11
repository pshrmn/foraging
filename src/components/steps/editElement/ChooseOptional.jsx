import React from 'react';

import Controls from 'components/common/StepControls';
import OptionalForm from 'components/forms/OptionalForm';

import { select } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { currentSelector } from 'constants/CSSClasses';

function initialOptional(props) {
  const { startData, endData = {} } = props;
  let optional = false;
  if ( endData.optional !== undefined ) {
    optional = endData.optional;
  } else if ( startData.optional !== undefined ) {
    optional = startData.optional;
  }
  return optional;
}

class ChooseOptional extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      optional: initialOptional(props)
    };
    this.nextHandler = this.nextHandler.bind(this);
    this.previousHandler = this.previousHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.toggleOptional = this.toggleOptional.bind(this);
  }
  
  nextHandler(event) {
    event.preventDefault();
    const { optional } = this.state;
    const { startData, next } = this.props;
    next(Object.assign({}, startData, { optional }));
  }

  previousHandler(event) {
    event.preventDefault();
    this.props.previous();
  }

  cancelHandler(event) {
    event.preventDefault();
    this.props.cancel();
  }

  toggleOptional(event) {
    this.setState({
      optional: event.target.checked
    });
  }

  render() {
    const { optional } = this.state;
    const { startData } = this.props;
    const { current, selector } = startData
    return (
      <form className='info-box'>
        <div className='info'>
          <OptionalForm optional={optional} toggle={this.toggleOptional} />
        </div>
        <Controls
          previous={this.previousHandler}
          next={this.nextHandler}
          cancel={this.cancelHandler} />
      </form>
    );
  }

  componentWillMount() {
    const { startData, extraData } = this.props;

    const { selector, spec } = startData;
    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;
    const elements = select(
      parentMatches,
      startData.selector,
      spec,
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  }

  componentWillUpdate(nextProps, nextState) {
    unhighlight(currentSelector);

    const { startData, extraData } = this.props;

    const { selector, spec } = startData;
    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;
    const elements = select(
      parentMatches,
      startData.selector,
      spec,
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
  }
}

export default ChooseOptional;
