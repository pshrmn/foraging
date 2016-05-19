import React from 'react';

import Controls from '../common/Controls';
import OptionalForm from '../elementForms/OptionalForm';

import { select } from '../../../helpers/selection';
import { highlight, unhighlight } from '../../../helpers/markup';
import { queryCheck } from '../../../constants/CSSClasses';

const ChooseOptional = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    let optional = false;
    if ( endData.optional !== undefined ) {
      optional = endData.optional;
    } else if ( startData.optional !== undefined ) {
      optional = startData.optional;
    }
    return {
      optional
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { optional } = this.state;
    const { startData, next } = this.props;
    next(Object.assign({}, startData, { optional }));
  },
  previousHandler: function(event) {
    event.preventDefault();
    this.props.previous();
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  toggleOptional: function(event) {
    this.setState({
      optional: event.target.checked
    });
  },
  render: function() {
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
  },
  componentWillMount: function() {
    const { startData } = this.props;
    const { current, selector, spec } = startData;
    const elements = select(current.matches, selector, spec, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(queryCheck);
    const { startData } = nextProps;
    const { current, selector, spec } = startData;
    const elements = select(current.matches, selector, spec, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUnmount: function() {
    unhighlight(queryCheck);
  }
});

export default ChooseOptional;
