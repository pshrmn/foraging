import React from "react";
import { connect } from "react-redux";

import Controls from "./Controls";
import Frames from "./frames/Frames";
import Tree from "./Tree";
import Preview from "./Preview";
import NoSelectMixin from "./NoSelectMixin";

const Forager = React.createClass({
  mixins: [NoSelectMixin],
  render: function() {
    // don't render anything when show=False
    return !this.props.show ? null :
      (
        <div id="forager" ref="parent">
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
