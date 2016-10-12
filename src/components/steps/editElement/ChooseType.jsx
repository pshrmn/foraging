import React from 'react';

import Controls from 'components/common/StepControls';
import TypeForm from 'components/forms/TypeForm.jsx';

import { select } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { currentSelector } from 'constants/CSSClasses';

function initialType(props) {
  const { startData, endData = {} } = props;
  let type = 'single';
  if ( endData.spec && endData.spec.type ) {
    type = endData.spec.type;
  } else if ( startData.spec && startData.spec.type ) {
    type = startData.spec.type;
  }
  return type;
}

function highlightElements(props, state) {
  const { startData, staticData } = props;
  const { type } = state;
  
  const { parent = {} } = staticData;
  const { matches: parentMatches = [document] } = parent;

  const spec = {
    type
  }
  // use set single index if possible
  if ( type === 'single' ) {
    const wasSingle = startData.spec && startData.spec.type === 'single';
    spec.index = wasSingle ? startData.spec.index : 0
  } else if ( type === 'range' ) {
    const wasRange = startData.spec && startData.spec.type === 'range';
    spec.low = wasRange ? startData.spec.low : 0;
    spec.high = wasRange ? startData.spec.high : undefined;
  }
  
  const elements = select(
    parentMatches,
    startData.selector,
    spec,
    '.forager-holder'
  );
  highlight(elements, currentSelector);
}

class ChooseType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: initialType(props)
    };

    this.nextHandler = this.nextHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.typeHandler = this.typeHandler.bind(this);
  }

  nextHandler(event) {
    event.preventDefault();
    const { type } = this.state;
    const { startData, next } = this.props;
    // handle resetting the value here if the type is changing
    let { spec } = startData;
    const newSpec = {
      type
    };
    next(Object.assign({}, startData, {spec: newSpec}));
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
          next={this.nextHandler}
          cancel={this.cancelHandler} />
      </form>
    );
  }

  componentWillMount() {
    highlightElements(this.props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    unhighlight(currentSelector);
    highlightElements(nextProps, nextState);
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
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
