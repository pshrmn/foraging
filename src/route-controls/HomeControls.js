import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PosButton } from 'components/common/Buttons';

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

  render() {
    const { pages } = this.props;
    return ([
      <PosButton
        key='add-page'
        click={this.addPage}
      >
        Add Page
      </PosButton>,
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
        : null
    ]);
  }
}

HomeControls.propTypes = {
  curi: PropTypes.object,
  pages: PropTypes.array
};

export default connect(
  state => ({
    curi: state.curi,
    pages: state.pages
  })
)(HomeControls);
