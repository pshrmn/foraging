import React from 'react';
import PropTypes from 'prop-types';

import Controls from 'components/common/StepControls';
import OptionalForm from 'components/forms/OptionalForm';

import { select } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { queryCheck, currentSelector } from 'constants/CSSClasses';

class ChooseOptional extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optional: initialOptional(this.props)
    };

    this.nextHandler = this.nextHandler.bind(this);
    this.previousHandler = this.previousHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.toggleOptional = this.toggleOptional.bind(this);
  }

  nextHandler(event) {
    event.preventDefault();
    const { optional } = this.state;
    const { startData, next } = this.props;
    next(Object.assign({}, startData, { optional }));
  }

  previousHandler(event) {
    event.preventDefault();
    this.props.previous();
  }

  cancelHandler(event) {
    event.preventDefault();
    this.props.cancel();
  }

  toggleOptional(event) {
    this.setState({
      optional: event.target.checked
    });
  }

  render() {
    const { optional } = this.state;

    return (
      <form className='info-box'>
        <div className='info'>
          <OptionalForm optional={optional} toggle={this.toggleOptional} />
        </div>
        <Controls
          previous={this.previousHandler}
          next={this.nextHandler}
          cancel={this.cancelHandler}
        />
      </form>
    );
  }

  componentDidMount() {
    highlightElements(this.props, this.state, this.props.highlightClass);
  }

  componentDidUpdate(prevProps) {
    // remove the highlight based on previous highlightClass
    unhighlight(prevProps.highlightClass);
    highlightElements(this.props, this.state, this.props.highlightClass);
  }

  componentWillUnmount() {
    unhighlight(this.props.highlightClass);
  }
}

ChooseOptional.propTypes = {
  startData: PropTypes.object.isRequired,
  endData: PropTypes.object,
  staticData: PropTypes.object,
  next: PropTypes.func,
  previous: PropTypes.func,
  cancel: PropTypes.func,
  highlightClass: PropTypes.string.isRequired
};

export const CreateOptional = props => (
  <ChooseOptional highlightClass={queryCheck} {...props} />
);

export const EditOptional = props => (
  <ChooseOptional highlightClass={currentSelector} {...props} />
);

function initialOptional(props) {
  const { startData, endData = {} } = props;
  let optional = false;
  if ( endData.optional !== undefined ) {
    optional = endData.optional;
  } else if ( startData.optional !== undefined ) {
    optional = startData.optional;
  }
  return optional;
}

function highlightElements(props, state, highlightClass) {
  const { startData, staticData } = props;

  const { selector, spec } = startData;
  const { parent = {} } = staticData;
  const { matches: parentMatches = [document] } = parent;
  const elements = select(
    parentMatches,
    selector,
    spec,
    '.forager-holder'
  );
  highlight(elements, highlightClass);
}
