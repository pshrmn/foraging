import React from "react";
import { connect } from "react-redux";

import Controls from "./Controls";
import Frames from "./frames/Frames";
import Tree from "./Tree";
import Preview from "./Preview";

const Forager = React.createClass({
  render: function() {
    // don't render anything when show=False
    return !this.props.show ? null :
      (
        <div id="forager">
          <Controls />
          <div className="workspace">
            <div className="graph">
              <Tree />
            </div>
            <Frames />
          </div>
          <Preview />
        </div>
      );
  }
});

export default connect(
  state => ({
    show: state.show
  })
)(Forager);
