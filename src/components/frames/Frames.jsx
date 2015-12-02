import React from "react";

import SelectorFrame from "./SelectorFrame";
import RuleFrame from "./RuleFrame";
import ElementFrame from "./ElementFrame";
import PartsFrame from "./PartsFrame";
import SpecFrame from "./SpecFrame";

import { highlight, unhighlight } from "../../helpers";

/*
 * Frames
 * ------
 *
 * The main way for a user to interact with Forager is through the Frames. There
 * are a number of different frames associated with different states of viewing
 * and creating selectors.
 *
 * Through its props, each frame is given any pertinent actions that, relevant
 * parts of the current selector (referred to as the parent when creating a 
 * new seletcor), and the destructured parts of a data object containing any
 * extra data for that frame.
 */
export default React.createClass({
  cssSelector: "current-selector",
  _selectFrame: function() {
    let { frame, selector, actions } = this.props;
    switch ( frame.name ) {
    case "selector":
      return <SelectorFrame selector={selector}
                            createSelector={actions.showElementFrame}
                            removeSelector={actions.removeSelector}
                            renameSelector={actions.renameSelector} 
                            createRule={actions.showRuleFrame}
                            removeRule={actions.removeRule} />
    case "rule":
      return <RuleFrame selector={selector}
                        save={actions.saveRule}
                        cancel={actions.showSelectorFrame} />
    case "element":
      return <ElementFrame parentElements={selector.elements}
                           next={actions.showPartsFrame}
                           cancel={actions.showSelectorFrame} />
    case "parts":
      return <PartsFrame parentElements={selector.elements}
                         next={actions.showSpecFrame}
                         cancel={actions.showSelectorFrame}
                         {...frame.data} />
    case "spec":
      return <SpecFrame parent={selector}
                        save={actions.saveSelector}
                        cancel={actions.showSelectorFrame}
                        {...frame.data} />
    default:
      return null;
    }
  },
  componentWillMount: function() {
    unhighlight(this.cssSelector);
    if ( this.props.selector ) {
      highlight(this.props.selector.elements, this.cssSelector);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    unhighlight(this.cssSelector);
    if ( nextProps.selector !== undefined && nextProps.selector !== this.props.selector ) {
      highlight(nextProps.selector.elements, this.cssSelector);
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
