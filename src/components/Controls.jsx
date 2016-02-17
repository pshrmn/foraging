import React from "react";
import { connect } from "react-redux";

import NoSelectMixin from "./NoSelectMixin";
import { PosButton, NeutralButton } from "./Buttons";
import Message from "./Message";

import { addPage, loadPage, closeForager } from "../actions";

const Controls = React.createClass({
  mixins: [NoSelectMixin],
  addHandler: function(event) {
    event.preventDefault();
    const name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");
    // don't bother sending an action if the user cancels or does not enter a name
    if ( name === null || name === "" ) {
      return;
    }
    this.props.addPage(name);
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
    closeForager
  }
)(Controls);
