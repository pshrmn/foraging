import React from "react";

import { PosButton, NegButton } from "../Inputs";
import { attributes, abbreviate } from "../../helpers";

export default React.createClass({
  getInitialState: function() {
    return {
      name: "",
      type: "string",
      attr: "",
      elementIndex: 0
    };
  },
  setName: function(event) {
    this.setState({
      name: event.target.value
    });
  },
  setType: function(event) {
    this.setState({
      type: event.target.value
    });
  },
  setAttr: function(attr) {
    this.setState({
      attr: attr
    });
  },
  saveHandler: function(event) {
    event.preventDefault();
    let { name, type, attr } = this.state;
    // basic validation
    if ( name !== "" && attr !== "" ) {
      this.props.actions.saveRule({
        name: name,
        type: type,
        attr: attr
      });
    }
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.actions.showSelectorFrame();
  },
  render: function() {
    let { selector, actions } = this.props;

    let typeRadios = ["string", "int", "float"].map((t,i) => {
      return (
        <label key={i}>
          {t}: <input type="radio"
                      name="rule-type"
                      value={t}
                      checked={t === this.state.type}
                      onChange={this.setType} />
        </label>
      );
    });
 
    return (
      <div className="frame rule-form">
        <div>
          <label>
            Name: <input type="text"
                   value={this.state.name}
                   onChange={this.setName} />
          </label>
        </div>
        <div>
          Type: {typeRadios}
        </div>
        <AttrChoices elements={selector.elements}
                     attr={this.state.attr}
                     setAttr={this.setAttr} />
        <div className="button">
          <PosButton text="Save" click={this.saveHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  }
});

let AttrChoices = React.createClass({
  getInitialState: function() {
    return {
      index: 0
    };
  },
  selectAttr: function(event) {
    this.props.setAttr(event.target.value);
  },
  elementAttributes: function(element) {
    let { attr } = this.props;
    return attributes(element).map((a,i) => {
      return (
        <li key={i}>
          <label>
            <input type="radio"
                   name="rule-attr"
                   value={a.name}
                   checked={a.name === attr }
                   onChange={this.selectAttr} />
            {a.name} - {abbreviate(a.value, 100)}
          </label>
        </li>
      );
    });
  },
  render: function() {
    let { elements, attr } = this.props;
    let attrs = this.elementAttributes(elements[this.state.index]);
    return (
      <ul>
        {attrs}
      </ul>
    );
  }
});
