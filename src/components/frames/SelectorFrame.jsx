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
      description = `Select element at index ${value}`;
    } else if ( type === "all" ) {
      description = `Select all elements, save as "${value}"`;
    }

    let rulesList = rules.length ? (
      <RuleList rules={rules}
                actions={this.props.actions} />
    ) : (
      <p>No Rules</p>
    );
    let optionalText = optional ? "(optional)" : "";
    return (
      <div className="frame">
        <div>
          <h2>{selector}</h2>
          <p>{description} {optionalText}</p>
          <div>
            Rules:
            {rulesList}
          </div>
          <PosButton text="Add Child" click={this.addChild} />
          <PosButton text="Add Rule" click={this.addRule} />
          <NegButton text="Remove" click={this.remove} />
        </div>
      </div>
    );
  }
});

let RuleList = React.createClass({
  render: function() {
    let { rules, actions } = this.props;
    let { removeRule } = actions;
    let list = rules.map((r,i) => {
      return <Rule key={i} index={i} remove={removeRule} {...r}/>;
    });

    return (
      <ul>
        {list}
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
      <li>
        <span className="name">{name}</span> &lt;{attr}&gt; ({type})
        <button onClick={this.handleClick}>{String.fromCharCode(215)}</button>
      </li>
    );
  }
});
