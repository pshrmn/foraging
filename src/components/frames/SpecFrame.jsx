import React from "react";

import { PosButton, NegButton } from "../Inputs";
import { createSelector, allSelect, count } from "../../helpers";

export default React.createClass({
  getInitialState: function() {
    return {
      type: "single",
      value: 0
    };
  },
  saveHandler: function(event) {
    event.preventDefault();
    let sel = createSelector(this.props.data.css, this.state.type, this.state.value);
    // if saving a selector that selects "select" elements, add a child selector
    // to match option elements
    if ( allSelect(this.props.selector.elements, sel.selector, sel.spec) ) {
      sel.children.push(createSelector("option", "all", "option"));
    }
    console.log(sel);
    //this.props.actions.saveSelector(selector);
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.actions.showSelectorFrame();
  },
  setSpec: function(type, value) {
    this.setState({
      type: type,
      value: value
    });
  },
  render: function() {
    let { selector, data } = this.props;
    let { css } = data;
    let elementCount = count(selector.elements, css);
    return (
      <div className="frame spec-form">
        {css}
        <SpecForm count={elementCount}
                  setSpec={this.setSpec}/>
        <div className="buttons">
          <PosButton text="Save" click={this.saveHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
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
      <div>
        <div>
          Choose Type:
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
  }
})