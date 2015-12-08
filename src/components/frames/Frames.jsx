import React from "react";

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
export default React.createClass({
  cssSelector: "current-element",
  _selectFrame: function() {
    let { frame, element, actions } = this.props;
    switch ( frame.name ) {
    case "element":
      return <ElementFrame element={element}
                           createElement={actions.showHTMLFrame}
                           removeElement={actions.removeElement}
                           renameElement={actions.renameElement} 
                           createRule={actions.showRuleFrame}
                           removeRule={actions.removeRule} />
    case "rule":
      return <RuleFrame element={element}
                        save={actions.saveRule}
                        cancel={actions.showElementFrame} />
    case "html":
      return <HTMLFrame parentElements={element.elements}
                        next={actions.showPartsFrame}
                        cancel={actions.showElementFrame}
                        message={actions.showMessage} />
    case "parts":
      return <PartsFrame parentElements={element.elements}
                         next={actions.showSpecFrame}
                         cancel={actions.showElementFrame}
                         message={actions.showMessage}
                         {...frame.data} />
    case "spec":
      return <SpecFrame parent={element}
                        save={actions.saveElement}
                        cancel={actions.showElementFrame}
                        message={actions.showMessage} 
                        {...frame.data} />
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
