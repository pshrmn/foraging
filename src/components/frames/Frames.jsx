import React from "react";

import ViewFrame from "./ViewFrame";
import ElementFrame from "./ElementFrame";
import SelectorFrame from "./SelectorFrame";
import SpecFrame from "./SpecFrame";

export default React.createClass({
  render: function() {
    let { form, page } = this.props;
    let frame = null;
    switch ( form ) {
    case "selector":
    default:
      frame = <ViewFrame page={page} />
      break;
    }

    return (
      <div className="frames">
        {frame}
      </div>
    );
  }
});
