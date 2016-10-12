import React from 'react';

import Controls from 'components/common/StepControls';
import TypeForm from 'components/forms/TypeForm';

import { select } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { queryCheck, currentSelector } from 'constants/CSSClasses';

class ChooseType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.setupState(props)
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
    const {
      highlight,
      highlightClass
    } = this.props;
    highlight(this.props, this.state, highlightClass);
  }

  componentWillUpdate(nextProps, nextState) {
    unhighlight(this.props.highlightClass);
    const {
      highlight,
      highlightClass
    } = nextProps;
    highlight(nextProps, nextState, highlightClass);
  }

  componentWillUnmount() {
    unhighlight(this.props.highlightClass);
  }
}

ChooseType.propTypes = {
  startData: React.PropTypes.object,
  endData: React.PropTypes.object,
  staticData: React.PropTypes.object,
  next: React.PropTypes.func,
  previous: React.PropTypes.func
};

export const CreateType = props => (
  <ChooseType
    highlight={createHighlightElements}
    highlightClass={queryCheck}
    setupState={initialCreateType}
    {...props} />
);

export const EditType = props => (
  <ChooseType
    highlight={editHighlightElements}
    highlightClass={currentSelector}
    setupState={initialEditType}
    {...props} />
);

function initialCreateType(props) {
  const { endData = {} } = props;
  let type = 'single';
  if ( endData.spec && endData.spec.type ) {
    type = endData.spec.type;
  }
  return type;
}

function initialEditType(props) {
  const { startData, endData = {} } = props;
  let type = 'single';
  if ( endData.spec && endData.spec.type ) {
    type = endData.spec.type;
  } else if ( startData.spec && startData.spec.type ) {
    type = startData.spec.type;
  }
  return type;
}


function createHighlightElements(props, state, highlightClass) {
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
  highlight(elements, highlightClass); 
}

function editHighlightElements(props, state, highlightClass) {
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
  highlight(elements, highlightClass);
}