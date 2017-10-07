import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AllForm from 'components/forms/AllForm';
import Controls from 'components/common/StepControls';

import { select } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { takenNames } from 'helpers/store';

import { showMessage } from 'expiring-redux-messages';
import { queryCheck, currentSelector } from 'constants/CSSClasses';

class AllValueStep extends React.Component {
  constructor(props) {
    super(props);
    const name = props.setupState(props);
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
      showMessage,
      validate
    } = this.props;


    if ( error ) {
      return;
    }

    const ok = validate(this.props, this.state);
    if ( !ok ) {
      showMessage(`"${name}" is a duplicate name and cannot be used.`, 5000, -1);
      return;
    }

    const newSpec = { type: 'all', name };
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
          error={error}
        />
      </form>
    );
  }

  componentWillMount() {
    highlightElements(this.props, this.state, this.props.highlightClass);
  }

  componentWillUpdate(nextProps, nextState) {
    // remove the highlight based on previous highlightClass
    unhighlight(this.props.highlightClass);
    highlightElements(nextProps, nextState, nextProps.highlightClass);
  }

  componentWillUnmount() {
    unhighlight(this.props.highlightClass);
  }
}

AllValueStep.propTypes = {
  startData: PropTypes.object,
  endData: PropTypes.object,
  staticData: PropTypes.object,
  next: PropTypes.func,
  previous: PropTypes.func,
  cancel: PropTypes.func,
  setupState: PropTypes.func,
  showMessage: PropTypes.func,
  validate: PropTypes.func,
  highlightClass: PropTypes.string,
  takenNames: PropTypes.array
};


const ConnectedAllValueStep = connect(
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

export const CreateAllValueStep = props => (
  <ConnectedAllValueStep
    setupState={initialCreateName}
    highlightClass={queryCheck}
    validate={validateCreate}
    {...props} />
);

export const EditAllValueStep = props => (
  <ConnectedAllValueStep
    setupState={initialEditName}
    highlightClass={currentSelector}
    validate={validateEdit}
    {...props} />
);

/*
 * when creating an All value, use endData and then startData to
 * set an initial name
 */
function initialCreateName(props) {
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

/*
 * when editing an All value, use endData and then staticData to
 * set an initial name
 */
function initialEditName(props) {
  const { staticData, endData = {} } = props;
  let name = '';
  if ( endData.spec && endData.spec.name !== undefined ) {
    name = endData.spec.name;
  } else if ( staticData.originalSpec && staticData.originalSpec.name !== undefined ) {
    name = staticData.originalSpec.name;
  }
  return name;
}

function validateCreate(props, state) {
  const { name } = state;
  const { takenNames } = props;
  return takenNames.every(n => n !== name);
}

function validateEdit(props, state) {
  const { name } = state;
  const { takenNames, staticData } = props;
  const originalName = staticData.originalSpec.name;
  // name is taken if we're keeping the same name
  return name === originalName || takenNames.every(n => n !== name);
}

function highlightElements(props, state, highlightClass) {
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
  highlight(elements, highlightClass);
}

