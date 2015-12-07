import React from "react";

import { PosButton, NeutralButton } from "./Inputs";
import Message from "./Message";

export default React.createClass({
  addHandler: function(event) {
    event.preventDefault();
    let name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");
    // don't bother sending an action if the user cancels or does not enter a name
    if ( name === null || name === "" ) {
      return;
    }
    this.props.actions.addPage(name);
  },
  loadHandler: function(event) {
    let nextPageIndex = parseInt(event.target.value, 10);
    let nextPage = this.props.pages[nextPageIndex]; 
    let element = nextPage !== undefined ? nextPage.element : undefined;
    this.props.actions.loadPage(nextPageIndex, element);
  },
  closeHandler: function(event){
    document.body.classList.remove("foraging");
    this.props.actions.closeForager();
  },
  render: function() {
    let { pages, index, message, actions } = this.props;
    let options = pages.map((p, i) => {
      let text = p === undefined ? "" : p.name;
      return (
        <option key={i} value={i}>{text}</option>
      );
    });
    return (
      <div className="topbar">
        <div className="controls">
          <div className="page-controls">
            {"Page "}
            <select value={index}
                    onChange={this.loadHandler}>
              {options}
            </select>
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
