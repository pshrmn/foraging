import React from 'react';
import { connect } from 'react-redux';

import { validName } from "../helpers/text";
import { PosButton, NegButton } from "./common/Buttons";
import { selectElement, renamePage, removePage,
  uploadPage, showPreview, showMessage } from "../actions";

/*
 * Interact with the Page to upload it to a server, preview what the Page would capture
 * on the current web page, rename the Page, and delete it.
 */
const PageControls = React.createClass({
  renameHandler: function(event) {
    event.preventDefault();
    const name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");
    const { pageNames, showMessage, renamePage } = this.props;
    // do nothing if the user cancels, does not enter a name, or enter the same name as the current one
    if ( !validName(name, pageNames)) {
      showMessage(
        `Invalid Name: "${name}"`,
        5000
      );
    } else {
      renamePage(name);
    }
  },
  deleteHandler: function(event) {
    const { page, removePage } = this.props;
    event.preventDefault();
    if ( !confirm(`Are you sure you want to delete the page "${page.name}"?`)) {
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
    if ( this.props.page === undefined ) {
      return null;
    }
    return (
      <div>
        <PosButton click={this.uploadHandler} text="Upload" />
        <PosButton click={this.previewHandler} text="Preview" />
        <PosButton click={this.renameHandler} text="Rename" />
        <NegButton click={this.deleteHandler} text="Delete" />
      </div>
    );
  }
});

export default connect(
  state => {
    const { page } = state;
    const { pages, pageIndex } = page;
    const currentPage = pages[pageIndex];
    return {
      page: currentPage,
      pageNames: pages.filter(p => p !== undefined).map(p => p.name),
    };
  },
  {
    showMessage,
    renamePage,
    removePage,
    uploadPage,
    showPreview
  }
)(PageControls);
