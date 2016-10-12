import React from 'react';
import { connect } from 'react-redux';

import AllForm from 'components/forms/AllForm';
import Controls from 'components/common/StepControls';

import { select, count } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { takenNames } from 'helpers/store';

import { showMessage } from 'expiring-redux-messages';
import { queryCheck } from 'constants/CSSClasses';

function initialName(props) {
  const { startData, endData = {} } = props;
  let name = '';
  // if there is an existing value, only use it if the types match
  if ( endData.spec && endData.spec.name !== undefined ) {
    name = endData.spec.name;
  } else if ( startData.spec && startData.spec.name ) {
    name = startData.spec.name;
  }
  return name;
}

function highlightElements(props, state) {
  const { startData, staticData } = props;
  const { name } = state;

  const { selector } = startData;
  const { parent } = staticData;
  const elements = select(
    parent.matches,
    selector,
    {type: 'all', name},
    '.forager-holder'
  );
  highlight(elements, queryCheck);
}

class AllValueStep extends React.Component {
  constructor(props) {
    super(props);
    const name = initialName(props);
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
      next,
      takenNames,
      showMessage
    } = this.props;

    if ( !takenNames.every(n => n !== name) ) {
      showMessage(`"${name}" is a duplicate name and cannot be used.`, 5000, -1);
      return;
    }
    if ( error ) {
      return;
    }
    const newSpec = {
      type: 'all',
      name
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
    unhighlight(queryCheck);
    highlightElements(nextProps, nextState);
  }

  componentWillUnmount() {
    unhighlight(queryCheck);
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

