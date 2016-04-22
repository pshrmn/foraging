import React from "react";
import { connect } from "react-redux";

import ElementFrame from "./ElementFrame";
import RuleFrame from "./RuleFrame";
import ElementWizard from "./ElementWizard";

import { highlight, unhighlight } from "../../helpers/markup";
import { currentSelector } from "../../constants/CSSClasses";

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
  componentWillMount: function() {
    unhighlight(currentSelector);
    if ( this.props.element ) {
      highlight(this.props.element.elements, currentSelector);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    unhighlight(currentSelector);
    if ( nextProps.element !== undefined && nextProps.element !== this.props.element ) {
      highlight(nextProps.element.elements, currentSelector);
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
    unhighlight(currentSelector);
  }
});

export default connect(
  state => {
    const { page, frame } = state;
    const { pages, pageIndex, elementIndex } = page;
    const currentPage = pages[pageIndex];
    const element = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
    return {
      frame,
      element
    }
  }
)(Frames);

