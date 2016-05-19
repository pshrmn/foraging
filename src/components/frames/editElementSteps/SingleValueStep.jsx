import React from 'react';

import Controls from '../common/Controls';
import SingleForm from '../elementForms/SingleForm';

import { select, count } from '../../../helpers/selection';
import { highlight, unhighlight } from '../../../helpers/markup';
import { currentSelector } from '../../../constants/CSSClasses';

const SingleValueStep = React.createClass({
  getInitialState: function() {
    const { extraData, endData = {} } = this.props;
    let index = 0;
    // if there is an existing index, only use it if the types match
    if ( endData.spec && endData.spec.index !== undefined ) {
      index = endData.spec.index;
    } else if ( extraData.originalSpec && extraData.originalSpec.index !== undefined ) {
      index = extraData.originalSpec.index;
    }
    return {
      index,
      error: false
    };
  },
  indexHandler: function(event) {
    const { value } = event.target;
    this.setState({
      index: parseInt(value, 10),
      error: false
    });
  },
  nextHandler: function(event) {
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
  },
  previousHandler: function(event) {
    event.preventDefault();
    this.props.previous();
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  render: function() {
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
  },
  componentWillMount: function() {
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
  },
  componentWillUpdate: function(nextProps, nextState) {
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
  },
  componentWillUnmount: function() {
    unhighlight(currentSelector);
  }
});

export default SingleValueStep;
