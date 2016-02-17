import React from "react";
import { connect } from "react-redux";

import { PosButton, NegButton } from "./Buttons";

import { preview } from "../helpers/preview";
import { hidePreview } from "../actions";

const Preview = React.createClass({
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
    if ( !this.props.visible ) {
      return null;
    }

    return (
      <div className="preview-holder">
        <div className="preview-bg" onClick={this.closeHandler} ></div>
        <div className="preview">
          <div>
            <PosButton text="Log to Console" click={this.logHandler} />
            <PosButton text="Pretty Log" click={this.prettyLogHandler} />
            <NegButton text="Close" click={this.closeHandler} />
          </div>
          <pre>
            {JSON.stringify(preview(this.props.page), null, 2)}
          </pre>
        </div>
      </div>
    );
  }
});

export default connect(
  state => ({
    page: state.page.pages[state.page.pageIndex],
    visible: state.preview.visible
  }),
  {
    close: hidePreview
  }
)(Preview);
