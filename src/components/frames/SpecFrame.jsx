import React from "react";

import { PosButton, NegButton } from "../Inputs";
import { createSelector, allSelect, count, select } from "../../helpers";

export default React.createClass({
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
    let sel = createSelector(this.props.data.css, type, value, optional);
    // generate the list of elements right away
    sel.elements = select(this.props.selector.elements, sel.selector, sel.spec);
    // if saving a selector that selects "select" elements, add a child selector
    // to match option elements
    if ( allSelect(sel.elements) ) {
      let optionsChild = createSelector("option", "all", "option", false);
      optionsChild.elements = select(sel.elements, optionsChild.selector, optionsChild.spec);
      sel.children.push(optionsChild);
    }
    // send the new selector and the parent
    this.props.actions.saveSelector(sel, this.props.selector.id);
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
  toggleOptional: function(event) {
    this.setState({
      optional: event.target.checked
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
        <div>
          <label>
            Optional: <input type="checkbox"
                             checked={this.state.optional}
                             onChange={this.toggleOptional} />
          </label>
        </div>
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