import React from 'react';
import PropTypes from 'prop-types';

import Controls from 'components/common/StepControls';

import { parts, select, count, allSelect } from 'helpers/selection';

import { highlight, unhighlight, iHighlight } from 'helpers/markup';
import { queryCheck, potentialSelector, hoverClass } from 'constants/CSSClasses';

/*
 * This step is used select an element within the page. An elements props is
 * passed to the frame, which is used when the frame is mounted/updated to attach
 * an event listener all child elements of the elements. When one of those elements
 * is clicked, an array of css selector options (from the clicked element to the
 * parent) will be rendered.
 */
class ChooseElement extends React.Component {
  constructor(props) {
    super(props);

    const selectors = [['*']];
    const { staticData } = this.props;
    const { parent } = staticData;
    // when current's elements are select elements, automatically add 'option'
    // to the selectors array since it cannot be selected by the user
    if ( allSelect(parent.matches) ) {
      selectors.push(['option']);
    }

    this.state = {
      // the index of the selected selector
      checked: undefined,
      // the array of possible selectors. each selector is an array of selector parts
      // ie tag name, class names, and id
      selectors: selectors,
      // the number of elements the currently selected selector matches
      eleCount: 0,
      error: true
    };

    this.mouseover = this.mouseover.bind(this);
    this.mouseout = this.mouseout.bind(this);
    this.click = this.click.bind(this);
    this.addEvents = this.addEvents.bind(this);

    this.setRadio = this.setRadio.bind(this);
    this.nextHandler = this.nextHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);

    this.addEvents(staticData);
  }

  mouseover(event) {
    event.target.classList.add(hoverClass);
  }

  mouseout(event) {
    event.target.classList.remove(hoverClass);
  }

  // requires a component to be bound to this in order to call setState
  click(event) {
    // preventDefault & stopPropagation to deal with
    // any real events from the page
    event.preventDefault();
    event.stopPropagation();
    const selectors = Array.from(event.path)
      .filter(ele => ele.classList && ele.classList.contains(potentialSelector))
      .reverse()
      .map(ele => parts(ele));
    this.setState({
      // maintain the wildcard selector
      selectors: [['*']].concat(selectors),
      checked: undefined,
      error: true
    });
  }

  addEvents(staticData) {
    // get all child elements of the parents
    const elements = select(
      staticData.parent.matches,
      null,
      null,
      '.forager-holder'
    );

    // remove any existing events
    if ( this.iUnhighlight ) {
      this.iUnhighlight();
      delete this.iUnhighlight;
    }

    this.iUnhighlight = iHighlight(
      elements,
      potentialSelector,
      this.mouseover,
      this.mouseout,
      this.click
    );
  }

  setRadio(i) {
    const selector = this.state.selectors[i].join('');
    const { staticData } = this.props;
    const { parent } = staticData;
    this.setState({
      checked: i,
      eleCount: count(parent.matches, selector),
      error: false
    });
  }

  nextHandler(event) {
    event.preventDefault();
    const { checked, selectors } = this.state;
    const { next } = this.props;
    const selectedSelector = selectors[checked];
    if ( checked !== undefined && selectedSelector !== undefined ) {
      next({
        parts: selectedSelector
      });
    } else {
      this.setState({
        error: true
      });
    }
  }

  cancelHandler(event) {
    event.preventDefault();
    this.props.cancel();
  }

  render() {
    const { selectors, checked, eleCount, error } = this.state;
    return (
      <form className='info-box'>
        <div className='info'>
          <h3>Select Relevant Element(s)</h3>
          <div className='choices'>
            {
              selectors.map((s, i) =>
                <SelectorRadio key={i}
                  selector={s}
                  index={i}
                  checked={i===checked}
                  select={this.setRadio}
                />
              )
            }
          </div>
          <h5>Count: {eleCount}</h5>
        </div>
        <Controls
          next={this.nextHandler}
          cancel={this.cancelHandler}
          error={error}
        />
      </form>
    );
  }

  /*
   * below here are the functions for interacting with the non-Forager part of the page
   */
  componentWillReceiveNewProps(nextProps) {
    const { staticData } = nextProps;
    this.addEvents(staticData);
  }

  /*
   * when a selector possibility is chosen, add a class to all matching elements
   * to show what that selector could match
   */
  componentWillUpdate(nextProps, nextState) {
    // remove any highlights from a previously selected selector
    unhighlight(queryCheck);
    const clickedSelector = nextState.selectors[nextState.checked];
    if ( clickedSelector !== undefined ) {
      const fullSelector = clickedSelector.join('');
      const { staticData } = nextProps;
      const elements = select(
        staticData.parent.matches,
        fullSelector,
        null,
        '.forager-holder'
      );
      highlight(elements, queryCheck);
    }
  }

  /*
   * remove any classes and event listeners from the page when the frame is unmounted
   */
  componentWillUnmount() {
    unhighlight(queryCheck);
    this.iUnhighlight();
  }
}

ChooseElement.propTypes = {
  startData: PropTypes.object,
  endData: PropTypes.object,
  staticData: PropTypes.object,
  next: PropTypes.func,
  previous: PropTypes.func,
  cancel: PropTypes.func
};

// do not call event.preventDefault() here or the checked dot will fail to render
const SelectorRadio = ({ selector, checked, select, index }) => (
  <label className={checked ? 'selected' : ''}>
    <input
      type='radio'
      name='css-selector'
      checked={checked}
      onChange={() => select(index) }
    />
    {selector.join('')}
  </label>
);

SelectorRadio.propTypes = {
  selector: PropTypes.array.isRequired,
  checked: PropTypes.bool.isRequired,
  select: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
};

export default ChooseElement;
