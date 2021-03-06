import React from 'react';
import PropTypes from 'prop-types';

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

    const { startData, staticData } = this.props;
    const { parts } = startData;
    const { parent } = staticData;
    const fullSelector = parts.join('');

    this.state = {
      parts: parts.map(name => ({name: name, checked: true})),
      eleCount: count(parent.matches, fullSelector),
      error: false
    };

    this.nextHandler = this.nextHandler.bind(this);
    this.previousHandler = this.previousHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.toggleRadio = this.toggleRadio.bind(this);
  }

  nextHandler(event) {
    event.preventDefault();
    const { parts } = this.state;
    const { next } = this.props;
    const selector = joinParts(parts);
    if ( selector !== '' ) {
      next({
        selector
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
    const { staticData } = this.props;
    const matches = staticData.parent.matches;

    setupHighlights(fullSelector, matches);
    this.setState({
      parts: parts,
      eleCount: fullSelector === '' ? 0 : count(matches, fullSelector),
      error: fullSelector === ''
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
            onChange={this.toggleRadio}
          />
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
          <h5>Count: {eleCount}</h5>
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

  componentDidMount() {
    const { startData, staticData } = this.props;
    const { parts } = startData;
    const { parent } = staticData;
    const fullSelector = parts.join('');
    setupHighlights(fullSelector, parent.matches);
  }

  componentWillUnmount() {
    unhighlight(queryCheck);
  }
}

ChooseParts.propTypes = {
  startData: PropTypes.object,
  endData: PropTypes.object,
  staticData: PropTypes.object,
  next: PropTypes.func,
  previous: PropTypes.func,
  cancel: PropTypes.func
};

export default ChooseParts;
