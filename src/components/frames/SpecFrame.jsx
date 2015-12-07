import React from "react";

import { PosButton, NegButton } from "../Inputs";
import { createSelector, allSelect, count, select, highlight, unhighlight } from "../../helpers";

export default React.createClass({
  highlight: "query-check",
  getInitialState: function() {
    return {
      type: "single",
      value: 0,
      optional: false
    };
  },
  saveHandler: function(event) {
    event.preventDefault();
    let { type, value, optional } = this.state;
    let { css, parent } = this.props;
    // all value must be set
    if ( type === "all" && value === "" ) {
      this.props.message("Name for type \"all\" selectors cannot be empty");
      return;
    }
    let sel = createSelector(css, type, value, optional);
    // generate the list of elements for the new selector
    sel.elements = select(parent.elements, sel.selector, sel.spec);
    sel.parent = parent;
    parent.children.push(sel);
    // if saving a selector that selects "select" elements, add a child selector
    // to match option elements
    if ( allSelect(sel.elements) ) {
      let optionsChild = createSelector("option", "all", "option", false);
      optionsChild.elements = select(sel.elements, optionsChild.selector, optionsChild.spec);
      optionsChild.parent = sel;
      sel.children.push(optionsChild);
    }
    this.props.save(sel);
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  setSpec: function(type, value) {
    this.setState({
      type: type,
      value: value
    });
  },
  toggleOptional: function(event) {
    this.setState({
      optional: event.target.checked
    });
  },
  render: function() {
    let { parent, css } = this.props;
    let elementCount = count(parent.elements, css);
    return (
      <div className="frame spec-form">
        <div className="info">
          <div>
            Selector: {css}
          </div>
          <SpecForm count={elementCount}
                    setSpec={this.setSpec}/>
          <div>
            <label>
              Optional: <input type="checkbox"
                               checked={this.state.optional}
                               onChange={this.toggleOptional} />
            </label>
          </div>
        </div>
        <div className="buttons">
          <PosButton text="Save" click={this.saveHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  },
  componentWillMount: function() {
    let elements = select(
      this.props.parent.elements,
      this.props.css, {
      type: this.state.type,
      value: this.state.value
    });
    highlight(elements, this.highlight);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(this.highlight);
    let elements = select(
      nextProps.parent.elements,
      nextProps.css, {
      type: nextState.type,
      value: nextState.value
    });
    highlight(elements, this.highlight);
  },
  componentWillUnmount: function() {
    unhighlight(this.highlight);
  }
});

let SpecForm = React.createClass({
  getInitialState: function() {
    return {
      type: "single",
      value: 0
    };
  },
  setType: function(event) {
    let type = event.target.value;
    let value;
    if ( type === "single" ) {
      value = 0;
    } else if ( type === "all" ) {
      value = "";
    }
    this.props.setSpec(type, value);
    this.setState({
      type: type,
      value: value
    });
  },
  setValue: function(event) {
    let value = event.target.value;
    if ( this.state.type === "single" ) {
      value = parseInt(value, 10);
    }
    this.setSpec(this.state.type, value);
    this.setState({
      value: value
    });
  },
  setSpec: function(type, value) {
    this.props.setSpec(type, value);
  },
  _singleValue: function() {
    let { value } = this.state;
    let options = [];
    for ( var i=0; i<this.props.count; i++ ) {
      options.push(
        <option key={i} value={i}>{i}</option>
      );
    }
    return (
      <select value={value}
              onChange={this.setValue} >
        {options}
      </select>
    );
  },
  _allValue: function() {
    return (
      <div>
        Name: <input type="text"
                     value={this.state.value}
                     onChange={this.setValue} />
      </div>
    );
  },
  render: function() {
    let valueChooser = this.state.type === "single" ? this._singleValue() : this._allValue();
    return (
      <div ref="frame">
        <div>
          Type:
          <label>single <input type="radio"
                               name="type"
                               value="single"
                               checked={this.state.type === "single"}
                               onChange={this.setType} />
          </label>
          <label>all <input type="radio"
                               name="type"
                               value="all"
                               checked={this.state.type === "all"}
                               onChange={this.setType} />
          </label>
        </div>
        {valueChooser}
      </div>
    );
  },
  // while this is normally done globally, the single/all swap doesn't use redux
  // so the .no-select class needs to be handled here
  _makeNoSelect: function() {
    [].slice.call(this.refs.frame.querySelectorAll("*")).forEach(c => {
      c.classList.add("no-select");
    });
  },
  componentDidMount: function() {
    // load the site's pages from chrome.storage.local and set the state
    this._makeNoSelect();
  },
  componentDidUpdate: function() {
    this._makeNoSelect();
  }
})