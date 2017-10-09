import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@curi/react';

import { PosButton } from 'components/common/Buttons';

import { fullGrow } from 'helpers/page';
import { preview } from 'helpers/preview';

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.logHandler = this.logHandler.bind(this);
    this.prettyLogHandler = this.prettyLogHandler.bind(this);
    this.varHandler = this.varHandler.bind(this);
  }

  logHandler(event) {
    event.preventDefault();
    /* eslint-disable no-console */
    console.log(JSON.stringify(preview(this.props.tree)));
    /* eslint-enable no-console */
  }

  prettyLogHandler(event) {
    event.preventDefault();
    /* eslint-disable no-console */
    console.log(JSON.stringify(preview(this.props.tree), null, 2));
    /* eslint-enable no-console */
  }

  varHandler(event) {
    event.preventDefault();
    /* eslint-disable no-console */
    console.log([
      'The current preview data can be accessed using the %c"pageData"%c variable.',
      'Make sure that the Forager extension\'s context is selected.',
      '(This will be a string using the extension\'s ID that starts with "chrome-extensions://". Open the chrome://extensions tab and look for the Forager extension to determine the extension ID)'
    ].join(' '), 'font-weight: bold; font-size: 1.5em;', '');
    /* eslint-enable no-console */
    window.pageData = preview(this.props.tree);
  }

  render() {
    return (
      <div className='frame'>
        <div className='preview'>
          <pre>
            {JSON.stringify(preview(this.props.tree), null, 2)}
          </pre>
          <div className='buttons'>
            <PosButton text='Log to Console' click={this.logHandler} />
            <PosButton text='Pretty Log' click={this.prettyLogHandler} />
            <PosButton text='Use as Variable' click={this.varHandler} />
            <Link
              to='Page'
              params={{ name: this.props.page.name }}
              anchor='button'
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  page: PropTypes.object,
  tree: PropTypes.object.isRequired,
};

export default connect(
  state => {
    const { pages, response } = state;
    const page = pages.find(p => p.name === response.params.name);
    return {
      page,
      tree: fullGrow(page.elements)
    };
  }
)(Preview);
