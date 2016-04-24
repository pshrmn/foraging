import React from "react";
import { connect } from "react-redux";

import ElementFrame from "./ElementFrame";
import RuleWizard from "./RuleWizard";
import ElementWizard from "./ElementWizard";

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
  /*
   * only the necessary actions are sent to the frame components
   */
  let frameElement = null;
  switch ( frame.name ) {
  case "element":
    frameElement = <ElementFrame />;
    break;
  case "wizard":
    frameElement = <ElementWizard />;
    break;
  case "rule":
    frameElement = <RuleWizard />;
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

