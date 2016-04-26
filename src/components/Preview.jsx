import React from "react";
import { connect } from "react-redux";

import { PosButton, NegButton } from "./common/Buttons";

import { fullGrow } from "../helpers/page";
import { preview } from "../helpers/preview";
import { hidePreview } from "../actions";

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
    if ( !this.props.visible ) {
      return null;
    }

    return (
      <div className="preview-holder">
        <div className="preview-bg" onClick={this.closeHandler} title="click to close"></div>
        <div className="preview">
          <div>
            <PosButton text="Log to Console" click={this.logHandler} />
            <PosButton text="Pretty Log" click={this.prettyLogHandler} />
            <NegButton text="Close" click={this.closeHandler} />
          </div>
          <pre>
            {JSON.stringify(preview(this.props.tree), null, 2)}
          </pre>
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
      visible: preview.visible,
      // only grow the tree when visible
      tree: preview.visible ? 
        currentPage === undefined ? {} : fullGrow(currentPage.elements) :
        undefined
    }
  },
  {
    close: hidePreview
  }
)(Preview);
