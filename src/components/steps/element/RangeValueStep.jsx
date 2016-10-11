import React from 'react';
import { connect } from 'react-redux';

import Controls from 'components/common/StepControls';
import RangeForm from 'components/forms/RangeForm';

import { select, count } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { levelNames } from 'helpers/page';
import { showMessage } from 'expiring-redux-messages';
import { queryCheck } from 'constants/CSSClasses';

function initialState(props) {
  const { startData, endData = {} } = props;
  let name = '';
  let low = 0;
  let high = 'end';

  if ( endData.spec ) {
    if ( endData.spec.name ) {
      name = endData.spec.name;
    }
    if ( endData.spec.low !== undefined) {
      low = endData.spec.low;
    }
    if ( endData.spec.high !== undefined ) {
      high = endData.spec.high === null ? 'end' : endData.spec.high;
    }
  } else if ( startData.spec ) {
    if ( startData.spec.name ) {
      name = startData.spec.name;
    }
    if ( startData.spec.low !== undefined) {
      low = startData.spec.low;
    }
    if ( startData.spec.high !== undefined ) {
      high = startData.spec.high === null ? 'end' : startData.spec.high;
    }
  }

  return {
    name,
    low,
    high,
    error: name === ''
  };
}

class RangeValueStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState(props);

    this.nameHandler = this.nameHandler.bind(this);
    this.lowHandler = this.lowHandler.bind(this);
    this.highHandler = this.highHandler.bind(this);
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

  lowHandler(event) {
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
  }

  highHandler(event) {
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
  }

  nextHandler(event) {
    event.preventDefault();
    const { name, low, high, error } = this.state;
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
      type: 'range',
      name,
      low,
      high: high === 'end'? null : high, // convert 'end' to null
    };
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
    const { name, low, high, error } = this.state;
    const { startData } = this.props;
    const { current, selector } = startData;

    const indices = count(current.matches, selector);

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
  }

  componentWillMount() {
    const { startData } = this.props;
    const { current, selector } = startData;
    const { name, low } = this.state;
    let { high } = this.state;
    if ( high === 'end' ) {
      high = null;
    }
    const elements = select(
      current.matches,
      selector,
      {type: 'range', name, low, high},
      '.forager-holder'
    );
    highlight(elements, queryCheck);
  }

  componentWillUpdate(nextProps, nextState) {
    unhighlight(queryCheck);

    const { startData } = nextProps;
    const { current, selector } = startData;
    const { name, low } = nextState;
    let { high } = nextState;
    if ( high === 'end' ) {
      high = null;
    }
    const elements = select(
      current.matches,
      selector,
      {type: 'range', name, low, high},
      '.forager-holder'
    );
    highlight(elements, queryCheck);
  }

  componentWillUnmount() {
    unhighlight(queryCheck);
  }
}

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
