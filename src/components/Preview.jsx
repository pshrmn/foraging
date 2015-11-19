import React from "react";

import { NeutralButton } from "./Inputs";

import { preview } from "../helpers";

export default React.createClass({
  clickHandler: function(event) {
    event.preventDefault();
    this.props.close();
  },
  render: function() {
    let { page } = this.props;
    let previewText = JSON.stringify(preview(page), null, 2);
    return (
      <div className="preview-holder">
        <div className="preview-bg" onClick={this.clickHandler} ></div>
        <div className="preview">
        <pre>
          {previewText}
        </pre>
        <NeutralButton text="Close" click={this.clickHandler} />
        </div>
      </div>
    );
  }
});