import React from "react";

import { PosButton, NegButton, NeutralButton } from "./Inputs";
import Message from "./Message";

import { legalName, createPage, setupPage } from "../helpers";

export default React.createClass({
  render: function() {
    let { pages, index, message, actions } = this.props;
    return (
      <div className="topbar">
        <div className="controls">
          <PageControls pages={pages}
                        index={index}
                        actions={actions} />
          <GeneralControls actions={actions}/>
        </div>
        <Message {...message} />
      </div>
    );
  }
});

let PageControls = React.createClass({
  getName: function() {
    let name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");
    if ( !legalName(name) ) {
      console.error("bad name", name);
      return;
    }
    return name;
  },
  checkName: function(name) {
    // if the name contains illegal characters, let the user know
    if ( !legalName(name) ) {
      let msg = `Name "${name}" contains one or more illegal characters (< > : \" \\ / | ? *)`;
      this.props.actions.showMessage(msg, 5000);
      return false;
    }
    // if a page with the name already exists, let the user know
    let exists = this.props.pages.some(curr => curr === undefined ? false : name === curr.name);
    if ( exists ) {
      this.props.actions.showMessage(`A page with the name "${name}" already exists`, 5000);
      return false;
    }
    return true;
  },
  addHandler: function(event) {
    event.preventDefault();
    let name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");
    // do nothing if the user cancels or does not enter a name
    if ( name === null || name === "" ) {
      return;
    }
    let good = this.checkName(name);
    if ( good ) {
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
    let name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");
    // do nothing if the user cancels, does not enter a name, or enter the same name as the current one
    if ( name === null || name === "" || name === curr.name) {
      return;
    }
    let good = this.checkName(name);
    if ( good ) {
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
    let nextPage = parseInt(event.target.value, 10);
    // the initial selector is the root selector of the page
    let selector = this.props.pages[nextPage];
    this.props.actions.loadPage(nextPage, selector);
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
      <NeutralButton text="Sync"
                     click={this.handle} />
      <NeutralButton text="Options"
                     click={this.handle} />
    */
    return (
      <div className="app-controls">
        <NeutralButton text={String.fromCharCode(215)}
                       classes={["transparent"]}
                       click={this.handleClose} />
      </div>
    );
  }
});
