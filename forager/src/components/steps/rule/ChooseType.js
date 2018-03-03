import React from 'react';
import PropTypes from 'prop-types';

import Controls from 'components/common/StepControls';

import { abbreviate } from 'helpers/text';
import { integer, float } from 'helpers/parse';

function initialType(props) {
  const { startData, endData = {} } = props;
  let type = 'string';
  if ( endData.type ) {
    type = endData.type;
  } else if ( startData.type ) {
    type = startData.type;
  }
  return type;
}

class ChooseType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: initialType(props)
    };

    this.nextHandler = this.nextHandler.bind(this);
    this.previousHandler = this.previousHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.typeHandler = this.typeHandler.bind(this);
  }

  nextHandler(event) {
    event.preventDefault();
    const { type } = this.state;
    const { startData, next } = this.props;
    next(Object.assign({}, startData, { type }));
  }

  previousHandler(event) {
    event.preventDefault();
    this.props.previous();
  }

  cancelHandler(event) {
    event.preventDefault();
    this.props.cancel();
  }

  typeHandler(event) {
    this.setState({
      type: event.target.value
    });
  }

  render() {
    const { type } = this.state;
    const { startData, children } = this.props;
    const { attribute } = startData;

    const { staticData } = this.props;
    const { current } = staticData;

    const value = attribute === 'text' ? current.innerText : current.getAttribute(attribute);

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
          {
            ['string', 'int', 'float'].map((t,i) => (
              <label key={i}>
                <input
                  type='radio'
                  value={t}
                  checked={t === type}
                  onChange={this.typeHandler}
                />
                {t}
              </label>
            ))
          }
          <p className='line'>
            {preview}
          </p>
          {children}
        </div>
        <Controls
          previous={this.previousHandler}
          next={this.nextHandler}
          cancel={this.cancelHandler} />
      </form>
    );
  }
}

ChooseType.propTypes = {
  startData: PropTypes.object.isRequired,
  staticData: PropTypes.object,
  next: PropTypes.func.isRequired,
  previous: PropTypes.func,
  cancel: PropTypes.func.isRequired,
  children: PropTypes.element
};

export default ChooseType;
