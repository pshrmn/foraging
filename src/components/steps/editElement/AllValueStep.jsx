import React from 'react';
import { connect } from 'react-redux';

import Controls from 'components/common/StepControls';
import AllForm from 'components/forms/AllForm';

import { select, count } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { takenNames } from 'helpers/store';

import { showMessage } from 'expiring-redux-messages';
import { currentSelector } from 'constants/CSSClasses';

/*
 * determine the name to pre-load using endData and staticData
 */
function initialName(props) {
  const { staticData, endData = {} } = props;
  let name = '';
  if ( endData.spec && endData.spec.name !== undefined ) {
    name = endData.spec.name;
  } else if ( staticData.originalSpec && staticData.originalSpec.name !== undefined ) {
    name = staticData.originalSpec.name;
  }
  return name;
}

/*
 * highlight elements selected by startData.selector
 */
function highlightElements(props, state) {
  const { startData, staticData } = props;
  const { name } = state;

  const { parent = {} } = staticData;
  const { matches: parentMatches = [document] } = parent;
  const elements = select(
    parentMatches,
    startData.selector,
    {type: 'all', name},
    '.forager-holder'
  );
  highlight(elements, currentSelector);
}

class AllValueStep extends React.Component {
  constructor(props) {
    super(props);
    const name = initialName(props)
    this.state = {
      name,
      error: name === ''
    };

    this.nameHandler = this.nameHandler.bind(this);
    this.nextHandler = this.nextHandler.bind(this);
    this.previousHandler = this.previousHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }

  nameHandler(event) {
    const { value } = event.target;
    this.setState({
      name: value,
      error: value === ''
    });
  }

  nextHandler(event) {
    event.preventDefault();
    const { name, error } = this.state;
    const {
      startData,
      staticData,
      next,
      takenNames,
      showMessage
    } = this.props;
    // do not do duplicate test if the name isn't changing
    const originalName = staticData.originalSpec.name;
    if ( name !== originalName && !takenNames.every(n => n !== name) ) {
      showMessage(`"${name}" is a duplicate name and cannot be used.`, 5000, -1);
      return;
    }

    if ( error ) {
      return;
    }
    next(
      Object.assign({}, startData, {
        spec: {type: 'all', name}
      })
    );
  }

  previousHandler(event) {
    event.preventDefault();
    this.props.previous();
  }

  cancelHandler(event) {
    event.preventDefault();
    this.props.cancel();
  }

  render() {
    const { name, error } = this.state;
    return (
      <form className='info-box'>
        <div className='info'>
          <AllForm name={name} setName={this.nameHandler} />
        </div>
        <Controls
          previous={this.previousHandler}
          next={this.nextHandler}
          cancel={this.cancelHandler}
          error={error} />
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

AllValueStep.propTypes = {
  startData: React.PropTypes.object,
  endData: React.PropTypes.object,
  staticData: React.PropTypes.object,
  next: React.PropTypes.func,
  previous: React.PropTypes.func
};

export default connect(
  state => {
    const { page } = state;
    return {
      takenNames: takenNames(page)
    };
  },
  {
    showMessage
  }
)(AllValueStep);
