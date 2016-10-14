import React from 'react';
import { connect } from 'react-redux';

import { PosButton, NegButton } from 'components/common/Buttons';
import Tree from 'components/Tree';

import { fullGrow } from 'helpers/page';
import { preview } from 'helpers/preview';
import { showElementFrame } from 'actions';

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.closeHandler = this.closeHandler.bind(this);
    this.logHandler = this.logHandler.bind(this);
    this.prettyLogHandler = this.prettyLogHandler.bind(this);
    this.varHandler = this.varHandler.bind(this);
  }

  closeHandler(event) {
    event.preventDefault();
    this.props.close();
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
        <Tree />
        <div className='preview'>
          <pre>
            {JSON.stringify(preview(this.props.tree), null, 2)}
          </pre>
          <div className='buttons'>
            <PosButton text='Log to Console' click={this.logHandler} />
            <PosButton text='Pretty Log' click={this.prettyLogHandler} />
            <PosButton text='Use as Variable' click={this.varHandler} />
            <NegButton text='Hide Preview' click={this.closeHandler} />
          </div>
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  close: React.PropTypes.func.isRequired,
  tree: React.PropTypes.Object.isRequired,
};

export default connect(
  state => {
    const { page } = state;
    const { pages, pageIndex } = page;
    const currentPage = pages[pageIndex];
    return {
      tree: currentPage === undefined ? {} : fullGrow(currentPage.elements)
    };
  },
  {
    close: showElementFrame
  }
)(Preview);
