import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@curi/react';
import { showMessage } from 'expiring-redux-messages';

import { PosButton, NegButton, NeutralButton } from 'components/common/Buttons';
import { validName } from 'helpers/text';
import { upload as chromeUpload } from 'helpers/chrome';
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
      removePage(page.name);
    }
  }

  handleRename = () => {
    const name = promptName();
    const { pages, showMessage, renamePage, curi } = this.props;
    // do nothing if the user cancels, does not enter a name, or enter the same name as the current one
    if ( !validName(name, pageNames(pages))) {
      showMessage(`Cannot Use Name: "${name}"`, 5000, -1);
    } else {
      renamePage(name, this.props.page.name);
      const pathname = curi.addons.pathname('Page', { name });
      curi.history.push(pathname);
    }
  }

  upload = () => {
    const { page, showMessage } = this.props;
    /* eslint-disable no-console */
    chromeUpload(page)
      .then(() => {
        showMessage('Upload successful', 5000, 1);
      })
      .catch(err => {
        showMessage(err, 5000, -1);
      });
    /* eslint-enable no-console */
  }

  render() {
    const { params } = this.props;

    return [
      <span key='page-name' className='page-name'>Page: {params.name}</span>,
      <Link
        key='preview'
        to='Preview'
        params={params}
        anchor='button'
        className='pos'
      >
        Preview
      </Link>,
      <PosButton
        key='upload'
        click={this.upload}
        title="Upload the current page's rules to your server"
      >
        Upload
      </PosButton>,
      <NeutralButton
        key='rename'
        click={this.handleRename}
        title='Rename the current page'
      >
        Rename Page
      </NeutralButton>,
      <NegButton
        key='delete'
        click={this.handleDelete}
        title='Delete the current page'
      >
        Delete Page
      </NegButton>
    ];
  }
}

PageControls.propTypes = {
  /* connect */
  curi: PropTypes.object,
  showMessage: PropTypes.func,
  renamePage: PropTypes.func,
  removePage: PropTypes.func,
  pages: PropTypes.array,
  page: PropTypes.object,
  params: PropTypes.object
};

export default connect(
  state => {
    const { curi, response, pages } = state;
    const current = response.params.name;
    return {
      pages: pages,
      page: pages.find(p => p.name === current),
      params: response.params,
      curi
    };
  },
  {
    showMessage,
    renamePage,
    removePage
  }
)(PageControls);
