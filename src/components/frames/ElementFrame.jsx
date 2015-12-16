import React from "react";

import { PosButton, NegButton, NeutralButton } from "../Buttons";

export default React.createClass({
  addChild: function(event) {
    this.props.createElement();
  },
  addRule: function(event) {
    this.props.createRule();
  },
  remove: function(event) {
    let { element } = this.props;
    if ( !confirm(`Are you sure you want to delete the element "${element.selector}"?`)) {
      return;
    }
    let parent = element.parent;
    if ( parent === null ) {
      // root "body" element
      element.children = [];
      element.rules = [];
    } else {
      parent.children = parent.children.filter(child => {
        return child !== element;
      });
    }
    this.props.removeElement();
  },
  rename: function(event) {
    let newName = window.prompt("New name to save element's array as:");
    if ( newName === null || newName === "" ) {
      return;
    }
    this.props.element.spec.value = newName;
    this.props.renameElement();
  },
  render: function() {
    if ( this.props.element === undefined ) {
      return null;
    }

    let { selector, rules, spec, optional } = this.props.element;
    let { type, value } = spec;
    let description = "";
    if ( type === "single" ) {
      description = `element at index ${value}`;
    } else if ( type === "all" ) {
      description = `all elements, stores them as "${value}"`;
      
    }
    let renameButton = type === "all" ? <NeutralButton text="Rename" click={this.rename} /> : null;
    // include spaces since this is text
    let optionalText = optional ? " (optional)" : "";
    return (
      <div className="frame">
        <div className="info">
          <div>
            Selector: <span className="big bold">{selector}</span> {optionalText}
          </div>
          <div>
            Captures: {description}
          </div>
          <RuleList rules={rules}
                    remove={this.props.removeRule} />
        </div>
        <div className="buttons">
          <PosButton text="Add Child"
                     click={this.addChild} />
          <PosButton text="Add Rule"
                     click={this.addRule} />
          <NegButton text="Remove"
                     title="Remove Element"
                     click={this.remove} />
          {renameButton}
        </div>
      </div>
    );
  }
});

let RuleList = React.createClass({
  render: function() {
    let { rules, remove } = this.props;
    if ( !rules.length ) {
      return null;
    }
    return (
      <ul className="rules">
        {
          rules.map((r,i) => {
            return <Rule key={i} index={i} remove={remove} {...r}/>;
          })
        }
      </ul>
    );
  }
})

let Rule = React.createClass({
  handleClick: function(event) {
    event.preventDefault();
    this.props.remove(this.props.index);
  },
  render: function() {
    let { name, attr, type } = this.props;
    return (
      <li className="rule">
        <span className="rule-name" title="name">{name}</span>
        <span className="rule-attr" title="attribute (or text)">{attr}</span>
        <span className="rule-type" title="data type">{type}</span>
        <NegButton text={String.fromCharCode(215)}
                   classes={["transparent"]}
                   click={this.handleClick} />
      </li>
    );
  }
});
