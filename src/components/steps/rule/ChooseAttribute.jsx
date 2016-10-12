import React from 'react';

import Controls from 'components/common/StepControls';

import { attributes } from 'helpers/attributes';
import { abbreviate } from 'helpers/text';

function initialAttribute(props) {
  const { startData, endData = {} } = props;
  
  let attribute = '';
  if ( endData.attribute ) {
    attribute = endData.attribute;
  } else if ( startData.attr ) {
    attribute = startData.attr;
  }
  return attribute;
}

class ChooseAttribute extends React.Component {
  constructor(props) {
    super(props);
    const attribute = initialAttribute(props);
    this.state = {
      attribute,
      error: attribute === ''
    };

    this.nextHandler = this.nextHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.attributeHandler = this.attributeHandler.bind(this);
  }

  nextHandler(event) {
    event.preventDefault();
    const { attribute, error } = this.state;

    if ( error ) {
      return;
    }

    const { startData, next } = this.props;
    next(Object.assign({}, startData, { attribute }));
  }

  cancelHandler(event) {
    event.preventDefault();
    this.props.cancel();
  }

  attributeHandler(event) {
    this.setState({
      attribute: event.target.value,
      error: false
    });
  }

  render() {
    const { attribute, index, error } = this.state;
    const { staticData } = this.props;
    const { element } = staticData;

    return (
      <form className='info-box'>
        <div className='info'>
          <h3>
            Which attribute has the value that you want?
          </h3>
          <ul>
            {
              attributes(element).map((a,i) => (
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
              ))
            }
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
}

export default ChooseAttribute;
