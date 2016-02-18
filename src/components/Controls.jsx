import React from "react";
import { connect } from "react-redux";

import NoSelectMixin from "./NoSelectMixin";
import { PosButton, NeutralButton } from "./Buttons";
import Message from "./Message";

import { validName } from "../helpers/text";
import { createPage, setupPage } from "../helpers/page";
import { addPage, loadPage, closeForager, showMessage } from "../actions";

const Controls = React.createClass({
  mixins: [NoSelectMixin],
  addHandler: function(event) {
    event.preventDefault();

    const name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");
    const existingNames = this.props.pages
      .filter(p => p !== undefined)
      .map(p => p.name);
    if ( !validName(name, existingNames) ) {
      this.props.showMessage(
        `Invalid Name: "${name}"`,
        5000
      );
    } else {

      const newPage = createPage(name);
      setupPage(newPage);
    
      this.props.addPage(newPage);
      
    }
  },
  loadHandler: function(event) {
    const nextPageIndex = parseInt(event.target.value, 10);
    const nextPage = this.props.pages[nextPageIndex]; 
    const element = nextPage !== undefined ? nextPage.element : undefined;
    this.props.loadPage(nextPageIndex, element);
  },
  closeHandler: function(event){
    document.body.classList.remove("foraging");
    this.props.closeForager();
  },
  pageControls: function() {
    const { pages, index } = this.props;
    const options = pages.map((p, i) => {
      return (
        <option key={i} value={i}>{p === undefined ? "" : p.name}</option>
      );
    });
    return (
      <select value={index}
              onChange={this.loadHandler}>
        {options}
      </select>
    );
  },
  render: function() {
    const { message } = this.props;
    return (
      <div className="topbar" ref="parent">
        <div className="controls">
          <div className="page-controls">
            {"Page "}
            {this.pageControls()}
            <PosButton text="Add Page"
                       click={this.addHandler} />
          </div>
          <div className="app-controls">
            <NeutralButton text={String.fromCharCode(215)}
                           classes={["transparent"]}
                           click={this.closeHandler} />
          </div>
        </div>
        <Message {...message} />
      </div>
    );
  }
});

export default connect(
  state => ({
    pages: state.page.pages,
    index: state.page.pageIndex,
    message: state.message
  }),
  {
    addPage,
    loadPage,
    closeForager,
    showMessage
  }
)(Controls);
