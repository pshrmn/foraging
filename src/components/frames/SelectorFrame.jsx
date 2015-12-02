import React from "react";

import { PosButton, NegButton } from "../Inputs";

export default React.createClass({
  addChild: function(event) {
    this.props.createSelector();
  },
  addRule: function(event) {
    this.props.createRule();
  },
  remove: function(event) {
    let { selector } = this.props;
    let parent = selector.parent;
    if ( parent === null ) {
      // root "body" selector
      selector.children = [];
      selector.rules = [];
    } else {
      parent.children = parent.children.filter(child => {
        return child !== selector;
      });
    }
    this.props.removeSelector();
  },
  render: function() {
    if ( this.props.selector === undefined ) {
      return null;
    }

    let { selector, rules, spec, optional } = this.props.selector;
    let { type, value } = spec;
    let description = "";
    if ( type === "single" ) {
      description = `element at index ${value}`;
    } else if ( type === "all" ) {
      description = `all elements, stores them as "${value}"`;
    }
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
                     title="Remove Selector"
                     click={this.remove} />
        </div>
      </div>
    );
  }
});

let RuleList = React.createClass({
  render: function() {
    let { rules, remove } = this.props;
    let list = rules.length ? rules.map((r,i) => {
      return <Rule key={i} index={i} remove={remove} {...r}/>;
    }) : (<li>No Rules</li>);
    return (
      <div className="rules">
        Rules:
        <ul>
          {list}
        </ul>
      </div>
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
        <span className="name">{name}</span> &lt;{attr}&gt; ({type})
        <NegButton text={String.fromCharCode(215)}
                   classes={["transparent"]}
                   click={this.handleClick} />
      </li>
    );
  }
});
