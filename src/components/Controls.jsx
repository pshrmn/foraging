import React from 'react';
import { connect } from 'react-redux';

import { PosButton, NegButton, NeutralButton } from 'components/common/Buttons';
import MessageBoard from 'components/MessageBoard';

import { validName } from 'helpers/text';
import { select } from 'helpers/selection';
import { createElement } from 'helpers/page';
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
} from 'actions';

function promptName() {
  return window.prompt('Page Name:\nCannot contain the following characters: < > : \' \\ / | ? * ');
}

function pageNames(pages) {
  return pages
    .filter(p => p !== undefined)
    .map(p => p.name);
}

class Controls extends React.Component {
  constructor(props) {
    super(props);

    this.addHandler = this.addHandler.bind(this);
    this.renameHandler = this.renameHandler.bind(this);
  }

  addHandler() {
    const { pages, showMessage, addPage } = this.props;
    const name = promptName();
    if ( !validName(name, pageNames(pages)) ) {
      showMessage(`Cannot Use Name: "${name}"`, 5000, -1);
    } else {
      let body = createElement('body');
      // initial values for the body element
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
  }

  renameHandler() {
    const name = promptName();
    const { pages, showMessage, renamePage } = this.props;
    // do nothing if the user cancels, does not enter a name, or enter the same name as the current one
    if ( !validName(name, pageNames(pages))) {
      showMessage(`Cannot Use Name: "${name}"`, 5000, -1);
    } else {
      renamePage(name);
    }
  }

  render() {
    const {
      pages,
      currentIndex,
      selectPage,
      uploadPage,
      showPreview,
      refreshMatches,
      syncPages,
      removePage,
      closeForager
    } = this.props;
    const active = currentIndex !== 0;
    return (
      <div className='topbar'>
        <div className='controls'>
          <div className='page-controls'>
            {'Page '}
            <select
              value={currentIndex}
              onChange={event => { selectPage(parseInt(event.target.value, 10)); }} >
              {
                pages.map((p, i) =>
                  <option key={i} value={i}>{p === undefined ? '' : p.name}</option>
                )
              }
            </select>
            <PosButton
              text='Add Page'
              click={this.addHandler} />
            <NeutralButton
              text='Refresh'
              title='Refresh the list of matched elements'
              click={() => { refreshMatches(); }}
              disabled={!active} />
            <PosButton
              text='Preview'
              click={() => { showPreview(); }}
              disabled={!active} />
            <NegButton
              text='Delete'
              click={() => { removePage(); }}
              disabled={!active} />
            <PosButton
              text='Rename'
              click={this.renameHandler}
              disabled={!active} />
            <PosButton
              text='Upload'
              click={() => { uploadPage(); }}
              disabled={!active} />
            <PosButton
              text='Sync Pages'
              click={() => { syncPages(); }} />
          </div>
          <div className='app-controls'>
            <NegButton
              text={String.fromCharCode(215)}
              classes={['transparent']}
              click={() => {
                document.body.classList.remove('foraging');
                closeForager();
              }} />
          </div>
        </div>
        <MessageBoard />
      </div>
    );
  }
}

Controls.propTypes = {
  currentIndex: React.PropTypes.number.isRequired,
  pages: React.PropTypes.array,
  addPage: React.PropTypes.func.isRequired,
  selectPage: React.PropTypes.func.isRequired,
  closeForager: React.PropTypes.func.isRequired,
  showMessage: React.PropTypes.func.isRequired,
  syncPages: React.PropTypes.func.isRequired,
  refreshMatches: React.PropTypes.func.isRequired,
  renamePage: React.PropTypes.func.isRequired,
  removePage: React.PropTypes.func.isRequired,
  uploadPage: React.PropTypes.func.isRequired,
  showPreview: React.PropTypes.func.isRequired
};

export default connect(
  state => {
    const { page } = state;
    const { pages, pageIndex } = page;
    return {
      currentIndex: pageIndex,
      pages
    };
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
