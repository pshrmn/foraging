import React from "react";
import { connect } from "react-redux";

import ElementFrame from "./ElementFrame";
import RuleFrame from "./RuleFrame";
import HTMLFrame from "./HTMLFrame";
import PartsFrame from "./PartsFrame";
import SpecFrame from "./SpecFrame";

import { highlight, unhighlight } from "../../helpers/markup";

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
  cssSelector: "current-element",
  _selectFrame: function() {
    const { frame } = this.props;
    /*
     * only the necessary actions are sent to the frame components
     */
    switch ( frame.name ) {
    case "element":
      return <ElementFrame />
    case "rule":
      return <RuleFrame />
    case "html":
      return <HTMLFrame />
    case "parts":
      return <PartsFrame />
    case "spec":
      return <SpecFrame />
    default:
      return null;
    }
  },
  componentWillMount: function() {
    unhighlight(this.cssSelector);
    if ( this.props.element ) {
      highlight(this.props.element.elements, this.cssSelector);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    unhighlight(this.cssSelector);
    if ( nextProps.element !== undefined && nextProps.element !== this.props.element ) {
      highlight(nextProps.element.elements, this.cssSelector);
    }
  },
  render: function() {
    return (
      <div className="frames">
        {this._selectFrame()}
      </div>
    );
  },
  componentWillUnmount: function() {
    unhighlight(this.cssSelector);
  }
});

export default connect(
  state => ({
    frame: state.frame,
    element: state.element
  })
)(Frames);

