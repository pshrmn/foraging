import React from 'react';

import Controls from 'components/common/StepControls';
import TypeForm from 'components/forms/TypeForm';

import { select } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { queryCheck } from 'constants/CSSClasses';

function initialType(props) {
  const { endData = {} } = props;
  let type = 'single';
  if ( endData.spec && endData.spec.type ) {
    type = endData.spec.type;
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
  }

  componentWillMount() {
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
  }

  componentWillUpdate(nextProps, nextState) {
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
  }

  componentWillUnmount() {
    unhighlight(queryCheck);
  }
}

export default ChooseType;
