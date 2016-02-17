import React from "react";
import { connect } from "react-redux";

import { PosButton, NegButton } from "../Buttons";
import NoSelectMixin from "../NoSelectMixin";

import { parts, select, count } from "../../helpers/selection";
import { stripEvents } from "../../helpers/attributes";
import { highlight, unhighlight, iHighlight, iUnhighlight } from "../../helpers/markup";
import { showPartsFrame, showElementFrame, showMessage } from "../../actions";

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
const HTMLFrame = React.createClass({
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
      const selectors = Array.from(event.path)
        .filter(function(ele){
            return ele.classList && ele.classList.contains("selectable-element");
        })
        .reverse()
        .map(function(ele){
            return parts(ele);
        });
      this.setState({
        // maintain the wildcard selector
        selectors: [["*"]].concat(selectors),
        checked: undefined
      });
    }
  },
  getInitialState: function() {
    return {
      // the index of the selected selector
      checked: undefined,
      // the array of possible selectors. each selector is an array of selector parts
      // ie tag name, class names, and id
      selectors: [["*"]],
      // the number of elements the currently selected selector matches
      eleCount: 0
    };
  },
  setRadio: function(i) {
    const selector = this.state.selectors[i].join("");
    this.setState({
      checked: i,
      eleCount: count(this.props.parentElements, selector)
    });
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { checked, selectors } = this.state;
    const selectedSelector = selectors[checked];
    if ( checked !== undefined && selectedSelector !== undefined ) {
      this.props.next(selectedSelector);
    } else {
      this.props.message("No selector selected");
    }
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  render: function() {
    const { selectors, checked, eleCount } = this.state;
    const opts = selectors.map((s, i) => {
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
    const clickedSelector = nextState.selectors[nextState.checked];
    if ( clickedSelector !== undefined ) {
      const fullSelector = clickedSelector.join("");
      const elements = select(nextProps.parentElements, fullSelector);
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
    const elements = select(parents).map(ele => stripEvents(ele));
    this.boundClick = this.events.click.bind(this);
    iHighlight(elements, this.potentialSelector, this.events.over, this.events.out, this.boundClick);
  }
});

const SelectorRadio = React.createClass({
  mixins: [NoSelectMixin],
  setRadio: function(event) {
    // do not call event.preventDefault() here or the checked dot will fail to render
    this.props.select(this.props.index);
  },
  render: function() {
    const { selector, checked } = this.props;
    return (
      <label ref="parent" className={checked ? "selected" : ""}>
        <input type="radio"
               name="css-selector"
               checked={checked}
               onChange={this.setRadio} />
        {selector.join("")}
      </label>
    );
  }
});

export default connect(
  state => ({
    parentElements: state.element.elements
  }),
  {
    next: showPartsFrame,
    cancel: showElementFrame,
    message: showMessage
  }
)(HTMLFrame);
