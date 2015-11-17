import React from "react";

import SelectorFrame from "./SelectorFrame";
import RuleFrame from "./RuleFrame";
import ElementFrame from "./ElementFrame";
import PartsFrame from "./PartsFrame";
import SpecFrame from "./SpecFrame";

export default React.createClass({
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
  render: function() {
    return (
      <div className="frames">
        {this._selectFrame()}
      </div>
    );
  }
});
