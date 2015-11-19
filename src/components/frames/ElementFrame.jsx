import React from "react";

import { PosButton, NegButton } from "../Inputs";
import { parts, select,
  highlight, unhighlight, iHighlight, iUnhighlight } from "../../helpers";

/*
 * ElementFrame
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
      checked: undefined,
      selectors: []
    };
  },
  setRadio: function(i) {
    this.setState({
      checked: i
    });
  },
  saveHandler: function(event) {
    event.preventDefault();
    let selector = this.state.selectors[this.state.checked];
    this.props.actions.showPartsFrame(selector);
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.actions.showSelectorFrame();
  },
  render: function() {
    let { selector, data } = this.props;
    let { selectors, checked } = this.state;
    let opts = selectors.map((s, i) => {
      return <SelectorRadio key={i}
                            selector={s}
                            index={i}
                            checked={i===checked}
                            select={this.setRadio} />
    });
    return (
      <div className="frame element-form">
        <div className="choices">
          {opts}
        </div>
        <div className="buttons">
          <PosButton text="Save" click={this.saveHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  },
  /*
   * below here are the functions for interacting with the non-Forager part of the page
   */
  componentWillMount: function() {
    this._setupPageEvents(this.props.selector.elements);
  },
  componentWillReceiveNewProps: function(nextProps) {
    this._setupPageEvents(nextProps.selector.elements);
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
      let elements = select(nextProps.selector.elements, fullSelector);
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
