import React from "react";

import { PosButton, NegButton } from "../Inputs";

export default React.createClass({
  addChild: function(event) {
    this.props.actions.showElementFrame();
  },
  addRule: function(event) {
    console.error("not yet implemented");
    this.props.actions.showRuleFrame();
  },
  remove: function(event) {
    console.error("not yet implemented");
  },
  render: function() {
    if ( this.props.selector === undefined ) {
      return null;
    }

    let { selector, children, rules, spec } = this.props.selector;
    let { type, value } = spec;
    let description = "";
    if ( type === "single" ) {
      description = `Select element at index ${value}`;
    } else if ( type === "all" ) {
      description = `Select all elements, save as "${value}"`;
    }

    let rulesList = rules.length ? (
      <RuleList rules={rules} />
    ) : (
      <p>No Rules</p>
    );

    return (
      <div className="frame">
        Selector Frame
        <div>
          <h2>{selector}</h2>
          <p>{description}</p>
          {rulesList}

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
    let { rules } = this.props;
    let list = rules.map((r,i) => {
      return <Rule key={i} {...r}/>;
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
    console.error("not yet implemented");
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
