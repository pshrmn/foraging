import React from 'react';

import Controls from 'components/common/StepControls';

import { attributes } from 'helpers/attributes';
import { abbreviate } from 'helpers/text';

const ChooseAttribute = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
  
    let attribute = '';
    if ( endData.attribute ) {
      attribute = endData.attribute;
    } else if ( startData.attr ) {
      attribute = startData.attr;
    }

    return {
      attribute,
      error: attribute === ''
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { attribute, error } = this.state;

    if ( error ) {
      return;
    }

    const { startData, next } = this.props;
    next(Object.assign({}, startData, { attribute }));
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  attributeHandler: function(event) {
    this.setState({
      attribute: event.target.value,
      error: false
    });
  },
  render: function() {
    const { attribute, index, error } = this.state;
    const { extraData } = this.props;
    const { element } = extraData;

    const attrs = attributes(element).map((a,i) => {
      return (
        <li key={i}>
          <label>
            <input
              type='radio'
              value={a.name}
              checked={a.name === attribute }
              onChange={this.attributeHandler} />
            {a.name}
          </label>
          <p className='line'>
            {abbreviate(a.value, 40)}
          </p>
        </li>
      );
    });
    return (
      <form className='info-box'>
        <div className='info'>
          <h3>
            Which attribute has the value that you want?
          </h3>
          <ul>
            {attrs}
          </ul>
          {this.props.children}
        </div>
        <Controls
          next={this.nextHandler}
          cancel={this.cancelHandler}
          error={error} />
      </form>
    );
  }
});

export default ChooseAttribute;
