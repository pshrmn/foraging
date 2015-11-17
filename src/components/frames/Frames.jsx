import React from "react";

import SelectorFrame from "./SelectorFrame";
import RuleFrame from "./RuleFrame";
import ElementFrame from "./ElementFrame";
import PartsFrame from "./PartsFrame";
import SpecFrame from "./SpecFrame";

import { highlight, unhighlight } from "../../helpers";

export default React.createClass({
  cssSelector: "current-selector",
  _selectFrame: function() {
    let { frame, selector, actions } = this.props;
    switch ( frame.name ) {
    case "selector":
      return <SelectorFrame selector={selector}
                            data={frame.data}
                            actions={actions} />
    case "rule":
      return <RuleFrame selector={selector}
                        data={frame.data}
                        actions={actions} />
    case "element":
      return <ElementFrame selector={selector}
                           data={frame.data}
                           actions={actions} />
    case "parts":
      return <PartsFrame selector={selector}
                         data={frame.data}
                         actions={actions} />
    case "spec":
      return <SpecFrame selector={selector}
                        data={frame.data}
                        actions={actions} />
    default:
      return null;
    }
  },
  componentWillMount: function() {
    if ( this.props.selector ) {
      this._highlightParents(this.props.selector.elements);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if ( nextProps.selector !== undefined && nextProps.selector !== this.props.selector ) {
      this._highlightParents(nextProps.selector.elements);
    }
  },
  componentWillUnmount: function() {
    unhighlight(this.cssSelector);
  },
  _highlightParents: function(elements) {
    unhighlight(this.cssSelector);
    highlight(elements, this.cssSelector);
  },
  render: function() {
    return (
      <div className="frames">
        {this._selectFrame()}
      </div>
    );
  }
});
