import React from 'react';

import Controls from 'components/common/StepControls';

import { abbreviate } from 'helpers/text';
import { integer, float } from 'helpers/parse';

const ChooseType = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    
    let type = 'string';
    if ( endData.type ) {
      type = endData.type;
    } else if ( startData.type ) {
      type = startData.type;
    }

    return {
      type
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { type } = this.state;
    const { startData, next } = this.props;
    next(Object.assign({}, startData, { type }));
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
    const { startData } = this.props;
    const { attribute } = startData;

    const { extraData } = this.props;
    const { element } = extraData;

    const value = attribute === 'text' ?
      element.innerText : element.getAttribute(attribute);

    const typeRadios = ['string', 'int', 'float'].map((t,i) => {
      return (
        <label key={i}>
          <input
            type='radio'
            value={t}
            checked={t === type}
            onChange={this.typeHandler} />
          {t}
        </label>
      );
    });

    let preview;
    switch (type) {
    case 'string':
      preview = abbreviate(value, 40);
      break;
    case 'int':
      preview = integer(value);
      if ( preview === null ) {
        preview = 'No int detected';
      }
      break;
    case 'float':
      preview = float(value);
      if ( preview === null ) {
        preview = 'No float detected';
      }
      break;
    }

    return (
      <form className='info-box'>
        <div className='info'>
          <h3>
            What type of value is this?
          </h3>
          {typeRadios}
          <p className='line'>
            {preview}
          </p>
          {this.props.children}
        </div>
        <Controls
          previous={this.previousHandler}
          next={this.nextHandler}
          cancel={this.cancelHandler} />
      </form>
    );
  }
});

export default ChooseType;
