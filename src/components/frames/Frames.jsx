import React from "react";
import { connect } from "react-redux";

import ElementFrame from "./ElementFrame";
import RuleFrame from "./RuleFrame";
import ElementWizard from "./ElementWizard";

/*
 * Frames
 * ------
 *
 * The main way for a user to interact with Forager is through the Frames. There
 * are a number of different frames associated with different states of viewing
 * and creating elements.
 *
 * Through its props, each frame is given any pertinent actions that, relevant
 * parts of the current element (referred to as the parent when creating a 
 * new element), and the destructured parts of a data object containing any
 * extra data for that frame.
 */
const Frames = React.createClass({
  _selectFrame: function() {
    const { frame } = this.props;
    /*
     * only the necessary actions are sent to the frame components
     */
    switch ( frame.name ) {
    case "element":
      return <ElementFrame />
    case "wizard":
      return <ElementWizard />
    case "rule":
      return <RuleFrame />
    default:
      return null;
    }
  },

  render: function() {
    return (
      <div className="frames">
        {this._selectFrame()}
      </div>
    );
  },
});

export default connect(
  state => ({
    frame: state.frame
  })
)(Frames);

