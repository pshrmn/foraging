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

function highlightElements(props, state) {
  const { startData, staticData } = props;
  const { type } = state;

  const { selector } = startData;
  const { parent } = staticData;

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
  const elements = select(parent.matches, selector, spec, '.forager-holder');
  highlight(elements, queryCheck); 
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
    highlightElements(this.props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    unhighlight(queryCheck);
    highlightElements(nextProps, nextState);
  }

  componentWillUnmount() {
    unhighlight(queryCheck);
  }
}

ChooseType.propTypes = {
  startData: React.PropTypes.object,
  endData: React.PropTypes.object,
  staticData: React.PropTypes.object,
  next: React.PropTypes.func,
  previous: React.PropTypes.func
};

export default ChooseType;
