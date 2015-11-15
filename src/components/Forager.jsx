import React from "react";

import Controls from "./Controls";
import Frames from "./frames/Frames";
import Graph from "./Graph";

export default React.createClass({
  getInitialState: function() {
    // this is just being used for dev and should be removed once saving/loaded
    // of pages is implemented
    return {
      pages: [
        undefined,
        {
        name: "example 1",
        selector: "body",
        spec: {
          type: "single",
          value: 0
        },
        children: [],
        rules: [{
          name: "test",
          attr: "text",
          type: "string"
        }]
      },
      {
        name: "example 2",
        selector: "body",
        spec: {
          type: "single",
          value: 0
        },
        children: [],
        rules: []
      }],
      pageIndex: 0
    };
  },
  loadPage: function(index) {
    this.setState({
      pageIndex: index
    });
  },
  addPage: function(page) {
    let pages = this.state.pages;
    pages.push(page);
    this.setState({
      pages: pages,
      pageIndex: pages.length - 1
    });
  },
  /*
   * remove the current page
   */
  removePage: function() {
    let { pages, pageIndex } = this.state;
    // can't delete the empty page
    if ( pageIndex === 0 ) {
      return;
    }
    pages.splice(pageIndex, 1);
    this.setState({
      pages: pages,
      pageIndex: 0
    });
  },
  renamePage: function(newName) {
    let { pages, pageIndex } = this.state;
    pages[pageIndex].name = newName;
    this.setState({
      pages: pages
    });
  },
  render: function() {
    let { pages, pageIndex } = this.state;
    let page = pages[pageIndex];
    return (
      <div className="forager no-select" ref="app">
        <Controls pages={pages}
                  index={pageIndex}
                  loadPage={this.loadPage}
                  addPage={this.addPage}
                  removePage={this.removePage}
                  renamePage={this.renamePage} />
        <div className="workspace">
          <Frames page={page} />
          <Graph page={page} />
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
