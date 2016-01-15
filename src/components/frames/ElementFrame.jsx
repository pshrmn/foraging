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
    const { element } = this.props;
    if ( !confirm(`Are you sure you want to delete the element "${element.selector}"?`)) {
      return;
    }
    const parent = element.parent;
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
    const newName = window.prompt("New name to save element's array as:");
    if ( newName === null || newName === "" ) {
      return;
    }
    this.props.element.spec.value = newName;
    this.props.renameElement();
  },
  toggleOptional: function(event) {
    this.props.toggleOptional(!this.props.element.optional);
  },
  render: function() {
    if ( this.props.element === undefined ) {
      return null;
    }

    const { selector, rules, spec, optional } = this.props.element;
    const { type, value } = spec;
    let description = "";
    if ( type === "single" ) {
      description = `element at index ${value}`;
    } else if ( type === "all" ) {
      description = `all elements, stores them as "${value}"`;
      
    }
    const renameButton = type === "all" ? <NeutralButton text="Rename" click={this.rename} /> : null;
    return (
      <div className="frame">
        <div className="info">
          <div>
            Selector: <span className="big bold">{selector}</span>
          </div>
          <div>
            Captures: {description}
          </div>
          <div>
            Optional: <input type="checkbox" checked={optional} onChange={this.toggleOptional} />
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

const RuleList = React.createClass({
  render: function() {
    const { rules, remove } = this.props;
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

const Rule = React.createClass({
  handleClick: function(event) {
    event.preventDefault();
    this.props.remove(this.props.index);
  },
  render: function() {
    const { name, attr, type } = this.props;
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
