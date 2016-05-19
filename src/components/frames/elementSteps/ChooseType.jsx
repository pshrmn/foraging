import React from 'react';

import Controls from '../common/Controls';
import TypeForm from '../elementForms/TypeForm.jsx';

import { select } from '../../../helpers/selection';
import { highlight, unhighlight } from '../../../helpers/markup';
import { queryCheck } from '../../../constants/CSSClasses';

const ChooseType = React.createClass({
  getInitialState: function() {
    const { endData = {} } = this.props;
    let type = 'single';
    if ( endData.spec && endData.spec.type ) {
      type = endData.spec.type;
    }

    return {
      type
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { type } = this.state;
    const { startData, next } = this.props;
    const newSpec = {
      type
    };
    // populate initial spec data based on the type
    switch ( type ) {
    case 'single':
      newSpec.index = 0;
      break;
    case 'all':
      newSpec.name = '';
      break;
    case 'range':
      newSpec.name = '';
      newSpec.low = 0;
      newSpec.high = undefined;
      break;
    }
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
  typeHandler: function(event) {
    this.setState({
      type: event.target.value
    });
  },
  render: function() {
    const { type } = this.state;
    const types = ['single', 'all', 'range'];
    return (
      <form className='info-box'>
        <div className='info'>
          <TypeForm types={types} current={type} setType={this.typeHandler} />
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
    const { current, selector } = startData;
    const { type } = this.state;
    const spec = {
      type
    }
    // use set single index if possible
    if ( type === 'single' ) {
      spec.index = 0
    } else if ( type === 'range' ) {
      spec.low = 0;
      spec.high = undefined;
    }
    const elements = select(current.matches, selector, spec, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(queryCheck);

    const { startData } = nextProps;
    const { current, selector } = startData;
    const { type } = nextState;
    const spec = {
      type
    }
    // use set single index if possible
    if ( type === 'single' ) {
      spec.index = 0
    } else if ( type === 'range' ) {
      spec.low = 0;
      spec.high = undefined;
    }
    const elements = select(current.matches, selector, spec, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUnmount: function() {
    unhighlight(queryCheck);
  }
});

export default ChooseType;
