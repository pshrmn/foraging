import React from "react";
import { connect } from "react-redux";

import NoSelectMixin from "./NoSelectMixin";
import { PosButton, NeutralButton } from "./common/Buttons";
import Message from "./Message";

import { validName } from "../helpers/text";
import { select } from "../helpers/selection";
import { createElement, selectElements } from "../helpers/page";
import { addPage, loadPage, closeForager, showMessage } from "../actions";

const Controls = React.createClass({
  mixins: [NoSelectMixin],
  addHandler: function(event) {
    event.preventDefault();
    const { pages, showMessage, addPage } = this.props;
    const name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");

    const existingNames = pages
      .filter(p => p !== undefined)
      .map(p => p.name);

    if ( !validName(name, existingNames) ) {
      showMessage(
        `Invalid Name: "${name}"`,
        5000
      );
    } else {
      
      let body = createElement("body");
      // initial values for the body selector
      body = Object.assign({}, body, {
        index: 0,
        parent: null,
        elements: [document.body]
      });

      addPage({
        name: name,
        elements: [body]
      });
      
    }
  },
  loadHandler: function(event) {
    this.props.loadPage(parseInt(event.target.value, 10));
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
