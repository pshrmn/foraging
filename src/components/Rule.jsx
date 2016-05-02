import React from "react";
import { connect } from "react-redux";

import { NegButton, NeutralButton } from "./common/Buttons";

import {
  removeRule,
  showEditRuleWizard
} from "../actions";


const Rule = React.createClass({
  propTypes: {
    removeRule: React.PropTypes.func.isRequired,
    updateRule: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    attr: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    active: React.PropTypes.bool
  },
  handleEdit: function(event) {
    event.preventDefault();
    this.props.updateRule(this.props.index);
  },
  handleRemove: function(event) {
    event.preventDefault();
    this.props.removeRule(this.props.index);
  },
  render: function() {
    const { name, attr, type, active = true } = this.props;
    return (
      <li className="rule">
        <span className="rule-name" title="name">{name}</span>
        <span className="rule-attr" title="attribute (or text)">{attr}</span>
        <span className="rule-type" title="data type">{type}</span>
        { active ? 
          <NeutralButton text="Edit"
                        click={this.handleEdit} />
          : null }
        { active ?
          <NegButton text="Delete"
                     click={this.handleRemove} />
          : null }
      </li>
    ); 
  }
})

export default connect(
  null,
  {
    removeRule,
    updateRule: showEditRuleWizard,
  }
)(Rule);
