import React from 'react';

import Controls from '../common/Controls';
import OptionalForm from '../elementForms/OptionalForm';

import { select } from '../../../helpers/selection';
import { highlight, unhighlight } from '../../../helpers/markup';
import { currentSelector } from '../../../constants/CSSClasses';

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
  },
  componentWillUpdate: function(nextProps, nextState) {
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
  },
  componentWillUnmount: function() {
    unhighlight(currentSelector);
  }
});

export default ChooseOptional;
