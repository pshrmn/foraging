import React from 'react';
import { connect } from 'react-redux';

import AllForm from 'components/forms/AllForm';
import Controls from 'components/common/StepControls';

import { select, count } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { levelNames } from 'helpers/page';
import { showMessage } from 'expiring-redux-messages';
import { queryCheck } from 'constants/CSSClasses';

const AllValueStep = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    let name = '';
    // if there is an existing value, only use it if the types match
    if ( endData.spec && endData.spec.name !== undefined ) {
      name = endData.spec.name;
    } else if ( startData.spec && startData.spec.name ) {
      name = startData.spec.name;
    }
    return {
      name: name,
      error: name === ''
    };
  },
  nameHandler: function(event) {
    const { value } = event.target;
    this.setState({
      name: value,
      error: value === ''
    });
  },
  nextHandler: function(event) {
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
  },
  previousHandler: function(event) {
    event.preventDefault();
    this.props.previous();
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  render: function() {
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
  },
  componentWillMount: function() {
    const { startData } = this.props;
    const { current, selector } = startData;
    const { name } = this.state;
    const elements = select(current.matches, selector, {type: 'all', name}, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(queryCheck);

    const { startData } = nextProps;
    const { current, selector } = startData;
    const { name } = nextState;
    const elements = select(current.matches, selector, {type: 'all', name}, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUnmount: function() {
    unhighlight(queryCheck);
  }
});

export default connect(
  state => {
    const { page } = state;
    const { pages, pageIndex, elementIndex } = page;

    const currentPage = pages[pageIndex];
    // use the current element's parent (if it has one) to get
    // the level because the take names for the current element
    // are in a different level. For the root node, use the elementIndex
    // (but this should never happen)
    const current = currentPage.elements[elementIndex];
    const index = current.parent !== null ? current.parent : elementIndex;
    return {
      takenNames: levelNames(currentPage.elements, index)
    };
  },
  {
    showMessage
  }
)(AllValueStep);

