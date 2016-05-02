import React from "react";
import { connect } from "react-redux";

import { PosButton, NegButton } from "../common/Buttons";
import Tree from "../Tree";

import { fullGrow } from "../../helpers/page";
import { preview } from "../../helpers/preview";
import { showElementFrame } from "../../actions";

const Preview = React.createClass({
  closeHandler: function(event) {
    event.preventDefault();
    this.props.close();
  },
  logHandler: function(event) {
    event.preventDefault();
    console.log(JSON.stringify(preview(this.props.tree)));
  },
  prettyLogHandler: function(event) {
    event.preventDefault();
    console.log(JSON.stringify(preview(this.props.tree), null, 2));
  },
  render: function() {
    return (
      <div className="frame">
        <Tree />
        <div className="preview">
          <pre>
            {JSON.stringify(preview(this.props.tree), null, 2)}
          </pre>
          <div className="buttons">
            <PosButton text="Log to Console" click={this.logHandler} />
            <PosButton text="Pretty Log" click={this.prettyLogHandler} />
            <NegButton text="Hide Preview" click={this.closeHandler} />
          </div>
        </div>
      </div>
    );
  }
});

export default connect(
  state => {
    const { page, preview } = state;
    const { pages, pageIndex } = page;
    const currentPage = pages[pageIndex];
    return {
      tree: currentPage === undefined ? {} : fullGrow(currentPage.elements)
    }
  },
  {
    close: showElementFrame
  }
)(Preview);
