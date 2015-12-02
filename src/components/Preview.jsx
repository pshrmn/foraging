import React from "react";

import { PosButton, NeutralButton } from "./Inputs";

import { preview } from "../helpers";

export default React.createClass({
  closeHandler: function(event) {
    event.preventDefault();
    this.props.close();
  },
  logHandler: function(event) {
    event.preventDefault();
    console.log(JSON.stringify(preview(this.props.page)));
  },
  prettyLogHandler: function(event) {
    event.preventDefault();
    console.log(JSON.stringify(preview(this.props.page), null, 2));
  },
  render: function() {
    let { page } = this.props;
    let previewText = JSON.stringify(preview(page), null, 2);
    return (
      <div className="preview-holder">
        <div className="preview-bg" onClick={this.closeHandler} ></div>
        <div className="preview">
        <pre>
          {previewText}
        </pre>
        <PosButton text="Log" click={this.logHandler} />
        <PosButton text="Pretty Log" click={this.prettyLogHandler} />
        <NeutralButton text="Close" click={this.closeHandler} />
        </div>
      </div>
    );
  }
});