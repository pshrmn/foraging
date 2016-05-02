import React from "react";
import { connect } from "react-redux";

import Element from "./Element";
import { PosButton, NegButton, NeutralButton } from "./common/Buttons";
import {
  showElementWizard,
  removeElement,
  showRuleWizard,
  showEditElementWizard
} from "../actions";

/*
 * An ElementCard is used to display a selector Element and its control functions
 */
const ElementCard = React.createClass({
  propTypes: {
    element: React.PropTypes.object,
    active: React.PropTypes.bool
  },
  addChild: function(event) {
    this.props.showElementWizard();
  },
  addRule: function(event) {
    this.props.showRuleWizard();
  },
  remove: function(event) {
    const { element, removeElement } = this.props;
    if ( !confirm(`Are you sure you want to delete the element "${element.selector}"?`)) {
      return;
    }
    removeElement();
  },
  edit: function() {
    this.props.showEditElementWizard();
  },
  render: function() {
    const { element, active = true } = this.props;
    return (
      <div className="info-box">
        <div className="info">
          <Element active={active} {...element} />
        </div>
        <div className="buttons">
          <PosButton text="Add Child"
                     disabled={!active}
                     click={this.addChild} />
          <PosButton text="Add Rule"
                     disabled={!active}
                     click={this.addRule} />
          <NeutralButton text="Edit"
                     disabled={!active}
                         click={this.edit} />
          <NegButton text="Delete"
                     title="Deletee Element"
                     disabled={!active}
                     click={this.remove} />
        </div>
      </div>
    );
  }
});

export default connect(
  null,
  {
    showElementWizard,
    removeElement,
    showRuleWizard,
    showEditElementWizard
  }
)(ElementCard);
