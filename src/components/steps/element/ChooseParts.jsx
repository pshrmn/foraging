import React from 'react';

import Controls from 'components/common/StepControls';

import { select, count } from 'helpers/selection';
import { highlight, unhighlight} from 'helpers/markup';
import { queryCheck } from 'constants/CSSClasses';

const joinParts = (parts) => (
  parts.reduce((str, curr) => str + (curr.checked ? curr.name : ''), '')
);

function setupHighlights(cssSelector, matches) {
  unhighlight(queryCheck);
  if ( cssSelector !== '' ) {
    const elements = select(matches, cssSelector, null, '.forager-holder');
    highlight(elements, queryCheck);
  }
}

class ChooseParts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parts: [],
      eleCount: 0,
      error: true
    };

    this.nextHandler = this.nextHandler.bind(this);
    this.previousHandler = this.previousHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.toggleRadio = this.toggleRadio.bind(this);
  }

  nextHandler(event) {
    event.preventDefault();
    const { parts } = this.state;
    const { next, startData } = this.props;
    const selector = joinParts(parts);
    if ( selector !== '' ) {
      next({
        selector,
        current: startData.current
      });
    } else {
      this.setState({
        error: true
      });
    }
  }

  previousHandler(event) {
    event.preventDefault();
    this.props.previous();
  }

  cancelHandler(event) {
    event.preventDefault();
    this.props.cancel();
  }

  toggleRadio(event) {
    // don't prevent default
    const index = event.target.value;
    const parts = this.state.parts;
    parts[index].checked = !parts[index].checked;
    const fullSelector = joinParts(parts);
    const { startData } = this.props;
    const matches = startData.current.matches;

    setupHighlights(fullSelector, matches);
    this.setState({
      parts: parts,
      eleCount: fullSelector === '' ? 0 : count(matches, fullSelector),
      error: fullSelector === ''
    });
  }

  componentWillMount() {
    const { startData } = this.props;
    const { parts, current } = startData;
    const fullSelector = parts.join('');

    setupHighlights(fullSelector, current.matches);
    this.setState({
      parts: parts.map(name => ({name: name, checked: true})),
      eleCount: count(current.matches, fullSelector),
      error: false
    });
  }

  render() {
    const { parts, eleCount, error } = this.state;
    const opts = parts.map((part, index) => {
      const { name, checked } = part;
      return (
        <label
          key={index}
          className={checked ? 'selected' : ''}>
          <input
            type='checkbox'
            name='selector-part'
            value={index}
            checked={checked}
            onChange={this.toggleRadio} />
          {name}
        </label>
      );
    });
    return (
      <form className='info-box'>
        <div className='info'>
          <h3>Select Relevant Part(s) of the CSS selector</h3>
          <div className='choices'>
            {opts}
          </div>
          <h5>Count: {this.state.eleCount}</h5>
        </div>
        <Controls
          previous={this.previousHandler}
          next={this.nextHandler}
          cancel={this.cancelHandler}
          error={error} />
      </form>
    );
  }

  componentWillUnmount() {
    unhighlight(queryCheck);
  }
}

export default ChooseParts;
