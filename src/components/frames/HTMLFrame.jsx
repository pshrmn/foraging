import React from "react";

import { PosButton, NegButton } from "../Buttons";

import { parts, select, count } from "../../helpers/selection";
import { stripEvents } from "../../helpers/attributes";
import { highlight, unhighlight, iHighlight, iUnhighlight } from "../../helpers/markup";

/*
 * HTMLFrame
 * ------------
 *
 * This frame is used select an element within the page. An elements props is
 * passed to the frame, which is used when the frame is mounted/updated to attach
 * an event listener all child elements of the elements. When one of those elements
 * is clicked, an array of css selector options (from the clicked element to the
 * parent) will be rendered.
 */
export default React.createClass({
  potentialSelector: "selectable-element",
  currentSelector: "query-check",
  events: {
    over: function(event) {
      event.target.classList.add("forager-highlight");
    },
    out: function(event) {
      event.target.classList.remove("forager-highlight");
    },
    click: function(event) {
      event.preventDefault();
      event.stopPropagation();
      let selectors = Array.from(event.path)
        .filter(function(ele){
            return ele.classList && ele.classList.contains("selectable-element");
        })
        .reverse()
        .map(function(ele){
            return parts(ele);
        });
      this.setState({
        selectors: selectors
      });
    }
  },
  getInitialState: function() {
    return {
      // the index of the selected selector
      checked: undefined,
      // the array of possible selectors
      selectors: [],
      // the number of elements the currently selected selector matches
      eleCount: 0
    };
  },
  setRadio: function(i) {
    let selector = this.state.selectors[i].join("");
    let eleCount = count(this.props.parentElements, selector);
    this.setState({
      checked: i,
      eleCount: eleCount
    });
  },
  nextHandler: function(event) {
    event.preventDefault();
    let { checked, selectors } = this.state;
    let s = selectors[checked];
    if ( checked !== undefined && s !== undefined ) {
      this.props.next(s);
    } else {
      this.props.message("No selector selected");
    }
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  render: function() {
    let { selectors, checked, eleCount } = this.state;
    let opts = selectors.map((s, i) => {
      return <SelectorRadio key={i}
                            selector={s}
                            index={i}
                            checked={i===checked}
                            select={this.setRadio} />
    });
    return (
      <div className="frame element-form">
        <div className="info">
          <h3>Select Relevant Element(s)</h3>
          <div className="choices">
            {opts}
          </div>
          <h5>Count: {eleCount}</h5>
        </div>
        <div className="buttons">
          <PosButton text="Next" click={this.nextHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  },
  /*
   * below here are the functions for interacting with the non-Forager part of the page
   */
  componentWillMount: function() {
    this._setupPageEvents(this.props.parentElements);
  },
  componentWillReceiveNewProps: function(nextProps) {
    this._setupPageEvents(nextProps.parentElements);
  },
  /*
   * when a selector possibility is chosen, add a class to all matching elements
   * to show what that selector could match
   */
  componentWillUpdate: function(nextProps, nextState) {
    // remove any highlights from a previously selected selector
    unhighlight(this.currentSelector);
    let clickedSelector = nextState.selectors[nextState.checked];
    if ( clickedSelector !== undefined ) {
      let fullSelector = clickedSelector.join("");
      let elements = select(nextProps.parentElements, fullSelector);
      highlight(elements, this.currentSelector);
    }
  },
  /*
   * remove any classes and event listeners from the page when the frame is unmounted
   */
  componentWillUnmount: function() {
    unhighlight(this.currentSelector);
    iUnhighlight(this.potentialSelector, this.events.over, this.events.out, this.boundClick);
    delete this.boundClick;
  },
  /*
   * attach a class and events to all child elements of the current selector
   */
  _setupPageEvents: function(parents) {
    let elements = select(parents);
    elements = elements.map(ele => stripEvents(ele));
    this.boundClick = this.events.click.bind(this);
    iHighlight(elements, this.potentialSelector, this.events.over, this.events.out, this.boundClick);
  }
});

let SelectorRadio = React.createClass({
  setRadio: function(event) {
    // do not call event.preventDefault() here or the checked dot will fail to render
    this.props.select(this.props.index);
  },
  render: function() {
    let { selector, checked } = this.props;
    let labelClass = checked ? "selected" : "";
    return (
      <label className={labelClass}>
        <input type="radio"
               name="css-selector"
               checked={checked}
               onChange={this.setRadio} />
        {selector.join("")}
      </label>
    );
  }
});
