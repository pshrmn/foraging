import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PosButton, NeutralButton } from 'components/common/Buttons';
import { syncPages } from 'actions';

class HomeControls extends React.Component {

  addPage = () => {
    const { curi } = this.props;
    const pathname = curi.addons.pathname('Add Page');
    curi.history.push(pathname);
  }

  gotoPage = (event) => {
    const { value } = event.target;
    if (value === '') {
      return;
    }
    const { curi } = this.props;
    const pathname = curi.addons.pathname('Page', { name: value });
    curi.history.push(pathname);
  }

  sync = () => {
    const confirmed = window.confirm('Syncing pages will overwrite duplicate pages. Continue?');
    if (confirmed) {
      this.props.syncPages();
    }
  }

  render() {
    const { pages } = this.props;
    return ([
      pages.length
        ? <select key='load-page' onChange={this.gotoPage} >
          <option value=''>Load a page...</option>
          {
            pages.map(page => (
              <option key={page.name} value={page.name}>
                {page.name}
              </option>
            ))
          }
        </select>
        : null,
      <PosButton
        key='add-page'
        click={this.addPage}
      >
        Add Page
      </PosButton>,
      <NeutralButton
        key='sync'
        click={this.sync}
        title='Synchronize pages with the ones stored on the server'
      >
        Sync Pages
      </NeutralButton>
    ]);
  }
}

HomeControls.propTypes = {
  curi: PropTypes.object,
  pages: PropTypes.array,
  syncPages: PropTypes.func
};

export default connect(
  state => ({
    curi: state.curi,
    pages: state.pages
  }),
  {
    syncPages
  }
)(HomeControls);
