import React from "react";
import { connect } from "react-redux";

import ElementFrame from "./ElementFrame";
import RuleWizard from "./RuleWizard";
import ElementWizard from "./ElementWizard";
import EditRuleWizard from "./EditRuleWizard";

/*
 * Frames
 * ------
 *
 * The main way for a user to interact with Forager is through the Frames. There
 * are a number of different frames associated with different states of viewing
 * and creating elements.
 *
 */
 function Frames(props) {
  const { frame } = props;
  let frameElement = null;
  switch ( frame.name ) {
  case "element":
    frameElement = <ElementFrame />;
    break;
  case "element-wizard":
    frameElement = <ElementWizard />;
    break;
  case "rule-wizard":
    frameElement = <RuleWizard />;
    break;
  case "edit-rule-wizard":
    frameElement = <EditRuleWizard />;
    break;
  }
  return (
    <div className="frames">
      { frameElement }
    </div>
  );
}

export default connect(
  state => ({
    frame: state.frame
  })
)(Frames);

