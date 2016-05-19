import React from 'react';
import { connect } from 'react-redux';

import { PosButton, NegButton, NeutralButton } from './common/Buttons';
import MessageBoard from './MessageBoard';

import { validName } from '../helpers/text';
import { select } from '../helpers/selection';
import { createElement } from '../helpers/page';
import { showMessage } from 'expiring-redux-messages';
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
} from '../actions';

const Controls = React.createClass({
  addHandler: function(event) {
    const { pages, showMessage, addPage } = this.props;
    const name = window.prompt('Page Name:\nCannot contain the following characters: < > : \' \\ / | ? * ');
    const pageNames = pages
      .filter(p => p !== undefined)
      .map(p => p.name);
    if ( !validName(name, pageNames) ) {
      showMessage(`Invalid Name: "${name}"`, 5000, -1);
    } else {
      
      let body = createElement('body');
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
    if (!window.confirm('Syncing pages will overwrite duplicate pages. Continue?')) {
      return;
    }
    this.props.syncPages();
  },
  closeHandler: function(event){
    document.body.classList.remove('foraging');
    this.props.closeForager();
  },
  pageSelect: function() {
    const { pages, currentIndex, selectPage } = this.props;
    const options = pages.map((p, i) => {
      return (
        <option key={i} value={i}>{p === undefined ? '' : p.name}</option>
      );
    });
    return (
      <select value={currentIndex}
              onChange={event => { selectPage(parseInt(event.target.value, 10)); }} >>
        {options}
      </select>
    );
  },
  renameHandler: function(event) {
    const name = window.prompt('Page Name:\nCannot contain the following characters: < > : \' \\ / | ? * ');
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
    if ( !confirm(`Are you sure you want to delete the page "${currentPage.name}"?`)) {
      return;
    }
    // report the current page index
    this.props.removePage();
  },
  render: function() {
    const {
      message,
      currentIndex,
      uploadPage,
      showPreview,
      refreshMatches
    } = this.props;
    const active = currentIndex !== 0;
    return (
      <div className='topbar'>
        <div className='controls'>
          <div className='page-controls'>
            {'Page '}
            {this.pageSelect()}
            <PosButton text='Add Page'
                       click={this.addHandler} />
            <NeutralButton text='Refresh'
                           title='Refresh the list of matched elements'
                           click={() => { refreshMatches(); }}
                           disabled={!active} />
            <PosButton text='Preview'
                       click={() => { showPreview() }} 
                       disabled={!active} />
            <NegButton text='Delete'
                       click={this.deleteHandler}
                       disabled={!active} />
            <PosButton text='Rename'
                       click={this.renameHandler}
                       disabled={!active} />
            <PosButton text='Upload'
                       click={() => { uploadPage(); }}
                       disabled={!active} />
            <PosButton text='Sync Pages'
                       click={this.syncHandler} />
          </div>
          <div className='app-controls'>
            <NegButton text={String.fromCharCode(215)}
                           classes={['transparent']}
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
