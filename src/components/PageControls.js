import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, curious } from '@curi/react';
import { showMessage } from 'expiring-redux-messages';

import { PosButton, NegButton, NeutralButton } from 'components/common/Buttons';
import { validName } from 'helpers/text';
import { renamePage, removePage } from 'actions';

function promptName() {
  return window.prompt('Page Name:\nCannot contain the following characters: < > : \' \\ / | ? * ');
}

function pageNames(pages) {
  return pages
    .filter(p => p !== undefined)
    .map(p => p.name);
}

class PageControls extends React.Component {
  handleDelete = () => {
    const { curi, removePage, page } = this.props;
    const confirmed = window.confirm(`Are you sure you want to delete the page "${page.name}"?`);
    if (confirmed) {
      const pathname = curi.addons.pathname('Home');
      curi.history.push(pathname);
      removePage();
    }
  }

  handleRename = () => {
    const name = promptName();
    const { pages, showMessage, renamePage, curi } = this.props;
    // do nothing if the user cancels, does not enter a name, or enter the same name as the current one
    if ( !validName(name, pageNames(pages))) {
      showMessage(`Cannot Use Name: "${name}"`, 5000, -1);
    } else {
      renamePage(name);
      const pathname = curi.addons.pathname('Page', { name });
      curi.history.push(pathname);
    }
  }

  upload = () => {
    /* eslint-disable no-console */
    console.log('Uploading...');
  }

  render() {
    const { params } = this.props;
    return (
      <div className='controls'>
        <Link to='Preview' params={params} anchor='button' className='pos'>
          Preview
        </Link>
        <PosButton
          text='Upload'
          click={this.upload}
          title="Upload the current page's rules to your server"
        />
        <NeutralButton
          text='Rename Page'
          click={this.handleRename}
          title='Rename the current page'
        />
        <NegButton
          text='Delete Page'
          click={this.handleDelete}
          title='Delete the current page'
        />
      </div>
    );
  }
}

PageControls.propTypes = {
  params: PropTypes.object,
  pages: PropTypes.array,
  page: PropTypes.object,
  /* curious */
  curi: PropTypes.object,
  /* actions */
  showMessage: PropTypes.func,
  renamePage: PropTypes.func,
  removePage: PropTypes.func
};

export default curious(connect(
  state => {
    const { response } = state;
    const current = response.params.name;
    const { pages } = state.page;
    return {
      pages: pages,
      page: pages.find(p => p.name === current)
    };
  },
  {
    showMessage,
    renamePage,
    removePage
  }
)(PageControls));
