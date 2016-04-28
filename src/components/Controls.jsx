import React from "react";
import { connect } from "react-redux";

import { PosButton, NegButton, NeutralButton } from "./common/Buttons";
import MessageBoard from "./MessageBoard";

import { validName } from "../helpers/text";
import { select } from "../helpers/selection";
import { createElement } from "../helpers/page";
import { showMessage } from "expiring-redux-messages";
import {
  addPage,
  selectPage,
  closeForager,
  syncPages,
  refreshMatches,
  renamePage,
  removePage,
  uploadPage,
  showPreview
} from "../actions";

const Controls = React.createClass({
  addHandler: function(event) {
    event.preventDefault();
    const { pages, showMessage, addPage } = this.props;
    const name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");
    const pageNames = pages
      .filter(p => p !== undefined)
      .map(p => p.name);
    if ( !validName(name, pageNames) ) {
      showMessage(`Invalid Name: "${name}"`, 5000, -1);
    } else {
      
      let body = createElement("body");
      // initial values for the body selector
      body = Object.assign({}, body, {
        index: 0,
        parent: null,
        matches: [document.body]
      });

      addPage({
        name: name,
        elements: [body]
      });
      
    }
  },
  syncHandler: function(event) {
    event.preventDefault();
    if (!window.confirm("Syncing pages will overwrite duplicate pages. Continue?")) {
      return;
    }
    this.props.syncPages();
  },
  loadHandler: function(event) {
    this.props.selectPage(parseInt(event.target.value, 10));
  },
  closeHandler: function(event){
    document.body.classList.remove("foraging");
    this.props.closeForager();
  },
  refreshHandler: function(event) {
    this.props.refreshMatches();
  },
  pageSelect: function() {
    const { pages, currentIndex } = this.props;
    const options = pages.map((p, i) => {
      return (
        <option key={i} value={i}>{p === undefined ? "" : p.name}</option>
      );
    });
    return (
      <select value={currentIndex}
              onChange={this.loadHandler}>
        {options}
      </select>
    );
  },
  renameHandler: function(event) {
    event.preventDefault();
    const name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");
    const { pages, showMessage, renamePage } = this.props;
    const pageNames = pages
      .filter(p => p !== undefined)
      .map(p => p.name);
    // do nothing if the user cancels, does not enter a name, or enter the same name as the current one
    if ( !validName(name, pageNames)) {
      showMessage(`Invalid Name: "${name}"`, 5000, -1);
    } else {
      renamePage(name);
    }
  },
  deleteHandler: function(event) {
    const { pages, currentIndex, removePage } = this.props;
    const currentPage = pages[currentIndex];
    event.preventDefault();
    if ( !confirm(`Are you sure you want to delete the page "${currentPage.name}"?`)) {
      return;
    }
    // report the current page index
    this.props.removePage();
  },
  uploadHandler: function(event) {
    event.preventDefault();
    this.props.uploadPage();
  },
  previewHandler: function(event) {
    event.preventDefault();
    this.props.showPreview();
  },
  render: function() {
    const { message, currentIndex } = this.props;
    const active = currentIndex !== 0;
    return (
      <div className="topbar">
        <div className="controls">
          <div className="page-controls">
            {"Page "}
            {this.pageSelect()}
            <PosButton text="Add Page"
                       click={this.addHandler} />
            <NeutralButton text="Refresh"
                           title="Refresh the list of matched elements"
                           click={this.refreshHandler}
                           disabled={!active} />
            <PosButton text="Preview"
                       click={this.previewHandler} 
                       disabled={!active} />
            <NegButton text="Delete"
                       click={this.deleteHandler}
                       disabled={!active} />
            <PosButton text="Rename"
                       click={this.renameHandler}
                       disabled={!active} />
            <PosButton text="Upload"
                       click={this.uploadHandler}
                       disabled={!active} />
            <PosButton text="Sync Pages"
                       click={this.syncHandler} />
          </div>
          <div className="app-controls">
            <NegButton text={String.fromCharCode(215)}
                           classes={["transparent"]}
                           click={this.closeHandler} />
          </div>
        </div>
        <MessageBoard />
      </div>
    );
  }
});

export default connect(
  state => {
    const { page } = state;
    const { pages, pageIndex } = page;
    return {
      currentIndex: pageIndex,
      pages
    }
  },
  {
    addPage,
    selectPage,
    closeForager,
    showMessage,
    syncPages,
    refreshMatches,
    renamePage,
    removePage,
    uploadPage,
    showPreview
  }
)(Controls);
