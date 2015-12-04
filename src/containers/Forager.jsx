import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as ForagerActions from "../actions";

import Controls from "../components/Controls";
import Frames from "../components/frames/Frames";
import Tree from "../components/Tree";
import Preview from "../components/Preview";

let Forager = React.createClass({
  render: function() {
    let { pages, pageIndex, selector, show,
          dispatch, frame, preview, message } = this.props;
    let page = pages[pageIndex];
    const actions = bindActionCreators(ForagerActions, dispatch);
    let classNames = ["no-select"];
    if ( !show ) {
      classNames.push("hidden");
    }
    let previewModal = preview.visible ? (
      <Preview page={page} close={actions.hidePreview} />
    ) : null;

    return (
      <div id="forager" className={classNames.join(" ")} ref="app">
        <Controls pages={pages}
                  index={pageIndex}
                  message={message}
                  actions={actions} />
        <div className="workspace">
          <Frames selector={selector}
                  frame={frame}
                  actions={actions} />
          <Tree page={page}
                selector={selector}
                selectSelector={actions.selectSelector}
                active={frame.name === "selector"}/>
        </div>
        {previewModal}
      </div>
    );
  },
  /*
   * When choosing elements in the page, the selector uses a :not(.no-select)
   * query to ignore certain elements. To make sure that no elements in the
   * Forager app are selected, this function selects all child elements in the
   * app and gives them the "no-select" class. This is done in lieu of manually
   * setting className="no-select" on all elements (and handling cases where
   * there are multiple classes on an element). Ideally a :not(.forager, .forager *)
   * selector would exist, but this will have to do.
   */
  _makeNoSelect: function() {
    [].slice.call(this.refs.app.querySelectorAll("*")).forEach(c => {
      c.classList.add("no-select");
    });
  },
  componentDidMount: function() {
    // load the site's pages from chrome.storage.local and set the state
    this._makeNoSelect();
  },
  componentDidUpdate: function() {
    this._makeNoSelect();
  }
});


function mapStateToProps(state) {
  // while pages and pageIndex are stored under page in the store,
  // destructure them in the app
  return {
    show: state.show,
    frame: state.frame,
    pages: state.page.pages,
    pageIndex: state.page.pageIndex,
    selector: state.selector,
    preview: state.preview,
    message: state.message
  };
}

export default connect(
  mapStateToProps
)(Forager);
