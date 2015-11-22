import React from "react";

import { PosButton, NegButton } from "../Inputs";

export default React.createClass({
  addChild: function(event) {
    this.props.actions.showElementFrame();
  },
  addRule: function(event) {
    this.props.actions.showRuleFrame();
  },
  remove: function(event) {
    this.props.actions.removeSelector(this.props.selector.id);
  },
  render: function() {
    if ( this.props.selector === undefined ) {
      return null;
    }

    let { selector, children, rules, spec, optional } = this.props.selector;
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
                    actions={this.props.actions} />
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
    let { rules, actions } = this.props;
    let { removeRule } = actions;
    let list = rules.length ? rules.map((r,i) => {
      return <Rule key={i} index={i} remove={removeRule} {...r}/>;
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
