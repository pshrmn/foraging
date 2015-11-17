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
  highlight: "selectable-element",
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
      var data = [].slice.call(event.path)
        .filter(function(ele){
            return ele.classList && ele.classList.contains("selectable-element");
        })
        .reverse()
        .map(function(ele){
            return parts(ele);
        });
      this.setState({
        selectors: data
      })
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
        <div className="element-selectors">
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
    let { selector } = this.props;
    this._setupPageEvents(selector.elements);
  },
  componentWillReceiveNewProps: function(nextProps) {
    let { selector } = nextProps;
    this._setupPageEvents(selector.elements);
  },
  componentWillUnmount: function() {
    this._removePageEvents();
  },
  _setupPageEvents: function(parents) {
    let elements = select(parents);
    // need to bind this, but also cache the function
    // for removal
    let boundClick = this.events.click.bind(this);
    this.boundClick = boundClick;
    iHighlight(elements, this.highlight, this.events.over, this.events.out, boundClick);
  },
  _removePageEvents: function() {
    iUnhighlight(this.highlight, this.events.over, this.events.out, this.boundClick);
    delete this.boundClick;
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
        {selector}
        <input type="radio"
               name="css-selector"
               checked={checked}
               onChange={this.setRadio} />
      </label>
    );
  }
});
