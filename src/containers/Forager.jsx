import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as ForagerActions from "../actions";

import Controls from "../components/Controls";
import Frames from "../components/frames/Frames";
import Graph from "../components/Graph";

let Forager = React.createClass({
  render: function() {
    let { pages, pageIndex, show, dispatch } = this.props;
    let page = pages[pageIndex];
    const actions = bindActionCreators(ForagerActions, dispatch);
    let classNames = ["forager", "no-select"];
    if ( !show ) {
      classNames.push("hidden");
    }
    return (
      <div className={classNames.join(" ")} ref="app">
        <Controls pages={pages}
                  index={pageIndex}
                  actions={actions} />
        <div className="workspace">
          <Frames page={page}
                  actions={actions} />
          <Graph page={page}
                 actions={actions} />
        </div>
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
  return {
    show: state.show,
    pages: state.pages,
    pageIndex: state.pageIndex
  };
}

export default connect(
  mapStateToProps
)(Forager);
