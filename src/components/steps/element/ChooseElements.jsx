import React from 'react';

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
const ChooseElement = React.createClass({
  propTypes: {
    startData: React.PropTypes.object,
    endData: React.PropTypes.object,
    next: React.PropTypes.func,
    previous: React.PropTypes.func
  },
  getInitialState: function() {
    const selectors = [['*']];
    const { startData } = this.props;
    const { current } = startData;
    // when current's elements are select elements, automatically add 'option'
    // to the selectors array since it cannot be selected by the user
    if ( allSelect(current.matches) ) {
      selectors.push(['option']);
    }
    return {
      // the index of the selected selector
      checked: undefined,
      // the array of possible selectors. each selector is an array of selector parts
      // ie tag name, class names, and id
      selectors: selectors,
      // the number of elements the currently selected selector matches
      eleCount: 0,
      error: true
    };
  },
  events: {
    mouseover(event) {
      event.target.classList.add(hoverClass);
    },

    mouseout(event) {
      event.target.classList.remove(hoverClass);
    },

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
  },
  setRadio: function(i) {
    const selector = this.state.selectors[i].join('');
    const { startData } = this.props;
    const { current } = startData;
    this.setState({
      checked: i,
      eleCount: count(current.matches, selector),
      error: false
    });
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { checked, selectors } = this.state;
    const { next, startData } = this.props;
    const selectedSelector = selectors[checked];
    if ( checked !== undefined && selectedSelector !== undefined ) {
      next({
        parts: selectedSelector,
        current: startData.current
      });
    } else {
      this.setState({
        error: true
      });
    }
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  render: function() {
    const { next, previous } = this.props;
    const { selectors, checked, eleCount, error } = this.state;
    return (
      <form className='info-box'>
        <div className='info'>
          <h3>Select Relevant Element(s)</h3>
          <div className='choices'>
            {selectors.map((s, i) =>
              <SelectorRadio key={i}
                selector={s}
                index={i}
                checked={i===checked}
                select={this.setRadio} />
              )
            }
          </div>
          <h5>Count: {eleCount}</h5>
        </div>
        <Controls
          next={this.nextHandler}
          cancel={this.cancelHandler}
          error={error} />
      </form>
    );
  },
  /*
   * below here are the functions for interacting with the non-Forager part of the page
   */
  componentWillMount: function() {
    const { startData } = this.props;
    this.addEvents(startData);
  },
  componentWillReceiveNewProps: function(nextProps) {
    const { startData } = nextProps;
    this.addEvents(startData);
  },
  addEvents: function(startData) {
    // get all child elements of the parents
    const elements = select(startData.current.matches, null, null, '.forager-holder');

    // remove any existing events
    if ( this.iUnhighlight ) {
      this.iUnhighlight();
      delete this.iUnhighlight;
    }

    // need to bind so that this.setState is callable
    this.events.boundClick = this.events.click.bind(this);
    this.iUnhighlight = iHighlight(
      elements,
      potentialSelector,
      this.events.mouseover,
      this.events.mouseout,
      this.events.boundClick
    );
  },
  /*
   * when a selector possibility is chosen, add a class to all matching elements
   * to show what that selector could match
   */
  componentWillUpdate: function(nextProps, nextState) {
    // remove any highlights from a previously selected selector
    unhighlight(queryCheck);
    const clickedSelector = nextState.selectors[nextState.checked];
    if ( clickedSelector !== undefined ) {
      const fullSelector = clickedSelector.join('');
      const { startData } = nextProps;
      const elements = select(startData.current.matches, fullSelector, null, '.forager-holder');
      highlight(elements, queryCheck);
    }
  },
  /*
   * remove any classes and event listeners from the page when the frame is unmounted
   */
  componentWillUnmount: function() {
    unhighlight(queryCheck);
    this.iUnhighlight();
  }
});

const SelectorRadio = React.createClass({
  setRadio: function(event) {
    // do not call event.preventDefault() here or the checked dot will fail to render
    this.props.select(this.props.index);
  },
  render: function() {
    const { selector, checked } = this.props;
    return (
      <label className={checked ? 'selected' : ''}>
        <input type='radio'
               name='css-selector'
               checked={checked}
               onChange={this.setRadio} />
        {selector.join('')}
      </label>
    );
  }
});

export default ChooseElement

