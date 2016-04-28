import React from "react";
import { connect } from "react-redux";

import Controls from "./Controls";
import Frames from "./frames/Frames";
import Tree from "./Tree";
import Preview from "./Preview";

function Forager(props) {
  return !props.show ? null :
    (
      <div id="forager">
        <Controls />
        { props.active ? (
          <div className="workspace">
            <div className="graph">
              <Tree />
            </div>
            <Frames />
          </div>
          ) : (
            null
          )
        }
        <Preview />
      </div>
    );  
}

export default connect(
  state => ({
    show: state.show,
    active: state.page.pageIndex !== 0
  })
)(Forager);
