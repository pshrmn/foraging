import React from "react";

import { PosButton, NegButton, NeutralButton } from "./Inputs";

import { legalName, createPage, setupPage } from "../helpers";

export default React.createClass({
  render: function() {
    let { pages, index, actions } = this.props;
    return (
      <div className="controls">
        <PageControls pages={pages}
                      index={index}
                      actions={actions} />
        <GeneralControls actions={actions}/>
      </div>
    );
  }
});

let PageControls = React.createClass({
  getName: function() {
    let name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \ / | ? * ");
    if ( !legalName(name) ) {
      console.error("bad name", name);
      return;
    }
    return name;
  },
  addHandler: function(event) {
    event.preventDefault();
    let name = this.getName();
    if ( name !== undefined ) {
      // report the new name
      let newPage = createPage(name);
      setupPage(newPage);
      this.props.actions.addPage(newPage);
    }
  },
  renameHandler: function(event) {
    event.preventDefault();
    let curr = this.props.pages[this.props.index];
    // don't do anything for the undefined option
    if ( curr === undefined ) {
      return;
    }
    let name = this.getName();
    if ( name !== undefined && name !== curr.name) {
      // set the new name
      this.props.actions.renamePage(name);
    }
  },
  deleteHandler: function(event) {
    event.preventDefault();
    // report the current page index
    this.props.actions.removePage();
  },
  uploadHandler: function(event) {
    event.preventDefault();
    this.props.actions.uploadPage();
  },
  previewHandler: function(event) {
    event.preventDefault();
    this.props.actions.showPreview();
  },
  loadPage: function(event) {
    this.props.actions.loadPage(event.target.value);
  },
  render: function() {
    let { pages, index } = this.props;
    let options = pages.map((p, i) => {
      let text = p === undefined ? "" : p.name;
      return (
        <option key={i} value={i}>{text}</option>
      );
    });
    return (
      <div className="page-controls">
        Page: <select value={index}
                      onChange={this.loadPage}>{
                options}
              </select>
        <PosButton click={this.addHandler} text="Add" />
        <PosButton click={this.renameHandler} text="Rename" />
        <NegButton click={this.deleteHandler} text="Delete" />
        <PosButton click={this.uploadHandler} text="Upload" />
        <PosButton click={this.previewHandler} text="Preview" />
      </div>
    );
  }
});

let GeneralControls = React.createClass({
  handleClose: function(event){
    document.body.classList.remove("foraging");
    this.props.actions.closeForager();
  },
  render: function() {
    /*
      no need to render these until their features have been implemented
      <NeutralButton click={this.handle} text="Sync" />
      <NeutralButton click={this.handle} text="Options" />
    */
    return (
      <div className="app-controls">
        <NeutralButton click={this.handleClose} text={String.fromCharCode(215)} />
      </div>
    );
  }
});
