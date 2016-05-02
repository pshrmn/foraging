import React from "react";
import { connect } from "react-redux";

import Tree from "../Tree";
import ElementCard from "../ElementCard";

import { highlight, unhighlight } from "../../helpers/markup";
import { currentSelector } from "../../constants/CSSClasses";

const ElementFrame = React.createClass({
  render: function() {
    const { element } = this.props;
    if ( element === undefined ) {
      return null;
    }

    return (
      <div className="frame">
        <Tree />
        <ElementCard element={element} active={true} />
      </div>
    );
  },
  componentWillMount: function() {
    unhighlight(currentSelector);
    if ( this.props.element ) {
      highlight(this.props.element.matches, currentSelector);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    unhighlight(currentSelector);
    if ( nextProps.element !== undefined && nextProps.element !== this.props.element ) {
      highlight(nextProps.element.matches, currentSelector);
    }
  },
  componentWillUnmount: function() {
    unhighlight(currentSelector);
  }
});

export default connect(
  state => {
    const { page } = state;
    const { pages, pageIndex, elementIndex } = page;
    const currentPage = pages[pageIndex];
    const element = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
    return {
      element: element
    }
  }
)(ElementFrame);
