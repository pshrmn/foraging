import React from "react";
import { connect } from "react-redux";

import Controls from "./Controls";
import Frames from "./frames/Frames";
import PageTree from "./PageTree";
import Preview from "./Preview";

const Forager = React.createClass({
  render: function() {
    const hidden = this.props.show ? "" : "hidden";
    return (
      <div id="forager" className={hidden}>
        <Controls  />
        <div className="workspace">
          <PageTree />
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
