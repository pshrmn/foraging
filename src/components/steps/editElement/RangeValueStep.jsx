import React from 'react';
import { connect } from 'react-redux';

import Controls from 'components/common/StepControls';
import RangeForm from 'components/forms/RangeForm';

import { select, count } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { levelNames } from 'helpers/page';
import { showMessage } from 'expiring-redux-messages';
import { currentSelector } from 'constants/CSSClasses';

const RangeValueStep = React.createClass({
  getInitialState: function() {
    const { extraData, endData = {} } = this.props;
    let name = '';
    let low = 0;
    let high = 'end';
    // if there is an existing value, only use it if the types match
    if ( endData.spec ) {
      const spec = endData.spec;
      if ( spec.name ) {
        name = spec.name;
      }
      if ( spec.low !== undefined) {
        low = spec.low;
      }
      if ( spec.high !== undefined ) {
        high = spec.high === null ? 'end' : spec.high;
      }
    } else if ( extraData.originalSpec ) {
      const spec = extraData.originalSpec;
      if ( spec.name ) {
        name = spec.name;
      }
      if ( spec.low !== undefined) {
        low = spec.low;
      }
      if ( spec.high !== undefined ) {
        high = spec.high === null ? 'end' : spec.high;
      }
    }
    return {
      name,
      low,
      high,
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
  lowHandler: function(event) {
    const { value } = event.target;
    let low = parseInt(value, 10);
    let { high } = this.state;
    if ( low > high ) {
      [high, low] = [low, high];
    }
    this.setState({
      low,
      high
    });
  },
  highHandler: function(event) {
    const { value } = event.target;
    if ( value === 'end' ) {
      this.setState({
        high: value
      });
      return;
    }
    let high = parseInt(value, 10);
    let { low } = this.state;
    if ( low > high ) {
      [high, low] = [low, high];
    }
    this.setState({
      low,
      high
    });
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { name, low, high, error } = this.state;
    const {
      startData,
      extraData,
      next,
      takenNames,
      showMessage
    } = this.props;

    // do not do duplicate test if the name isn't changing
    const originalName = extraData.originalSpec.name;
    if ( name !== originalName && !takenNames.every(n => n !== name) ) {
      showMessage(`"${name}" is a duplicate name and cannot be used.`, 5000, -1);
      return;
    }
    if ( error ) {
      return;
    }
    const newSpec = {
      type: 'range',
      name,
      low,
      high: high === 'end'? null : high, // convert 'end' to null
    };
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
    const { name, low, high, error } = this.state;
    const { startData, extraData } = this.props;

    const { selector } = startData;
    const { parent = {} } = extraData
    const { matches = [document] } = parent;

    const indices = count(matches, selector);

    return (
      <form className='info-box'>
        <div className='info'>
          <RangeForm
            name={name}
            low={low}
            high={high}
            count={indices}
            setName={this.nameHandler}
            setLow={this.lowHandler}
            setHigh={this.highHandler} />
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
    const { startData, extraData } = this.props;

    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;

    const { name, low } = this.state;
    let { high } = this.state;
    if ( high === 'end' ) {
      high = null;
    }
    const elements = select(
      parentMatches,
      startData.selector,
      {type: 'range', name, low, high},
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(currentSelector);
    const { startData, extraData } = nextProps;

    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;

    const { name, low } = nextState;
    let { high } = nextState;
    if ( high === 'end' ) {
      high = null;
    }
    const elements = select(
      parentMatches,
      startData.selector,
      {type: 'range', name, low, high},
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  },
  componentWillUnmount: function() {
    unhighlight(currentSelector);
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
)(RangeValueStep);
