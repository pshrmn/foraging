import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@curi/react';

import { PosButton } from 'components/common/Buttons';

class PreviewControls extends React.Component {
  constructor(props) {
    super(props);
    this.logHandler = this.logHandler.bind(this);
    this.prettyLogHandler = this.prettyLogHandler.bind(this);
    this.varHandler = this.varHandler.bind(this);
  }

  logHandler(event) {
    event.preventDefault();
    /* eslint-disable no-console */
    console.log(JSON.stringify(this.props.data.tree));
    /* eslint-enable no-console */
  }

  prettyLogHandler(event) {
    event.preventDefault();
    /* eslint-disable no-console */
    console.log(JSON.stringify(this.props.data.tree, null, 2));
    /* eslint-enable no-console */
  }

  varHandler(event) {
    event.preventDefault();
    /* eslint-disable no-console */
    console.log([
      'The current preview data can be accessed using the %c"pageData"%c variable.',
      'Make sure that the Forager extension\'s context is selected.',
      '(The dropdown probably says "top" currently)'
    ].join(' '), 'font-weight: bold; font-size: 1.5em;', '');
    /* eslint-enable no-console */
    window.pageData = this.props.data.tree;
  }

  render() {
    return [
      <Link
        key='back'
        to='Page'
        params={{ name: this.props.data.name }}
        anchor='button'
      >
        Back
      </Link>,
      <PosButton
        key='log'
        text='Log to Console'
        title='Log the output to the dev tools console.'
        click={this.logHandler}
      />,
      <PosButton
        key='pretty-log'
        text='Pretty Log'
        title='Log the output to the dev tools console in a pretty printed format.'
        click={this.prettyLogHandler}
      />,
      <PosButton
        key='variable'
        text='Use as Variable'
        title='Store the preview data as a variable that is available in the dev tools console.'
        click={this.varHandler}
      />
    ];
  }
}

PreviewControls.propTypes = {
  data: PropTypes.object
};

export default PreviewControls;

