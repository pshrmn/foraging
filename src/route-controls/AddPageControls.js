import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@curi/react';
import { connect } from 'react-redux';

import { addPage } from 'actions';
import { showMessage } from 'expiring-redux-messages';
import { createElement } from 'helpers/page';


class AddPageControls extends React.Component {

  state = { name: '' };

  handleName = (event) => {
    this.setState({ name: event.target.value });
  }

  addPage = (event) => {
    event.preventDefault();
    const { curi, addPage, showMessage, takenNames } = this.props;
    const { name } = this.state;

    if (name === '') {
      showMessage("Page name cannot be an empty string", 5000, -1);
      return;
    } else if (takenNames.some(n => n === name)) {
      showMessage(`"${name}" is a duplicate name and cannot be used.`, 5000, -1);
      return;
    }

    let body = createElement('body');
    // initial values for the body element
    body = Object.assign({}, body, {
      index: 0,
      parent: null,
      matches: [document.body]
    });

    addPage({ name, elements: [body] });
    const pathname = curi.addons.pathname('Page', { name });
    curi.history.push(pathname);
  }

  render() {
    const { name } = this.state;
    return  ([
      <input
        key='input'
        type='text'
        value={name}
        onChange={this.handleName}
        placeholder='Add a new page'
      />,
      <button key='submit' type='button' onClick={this.addPage}>Add Page</button>,
      <Link key='cancel' to='Home' anchor='button' className='neg'>Cancel</Link>,
    ]);
  }
}

AddPageControls.propTypes = {
  /* connect */
  curi: PropTypes.object,
  takenNames: PropTypes.array,
  addPage: PropTypes.func,
  showMessage: PropTypes.func
};

export default connect(
  state => {
    return {
      takenNames: state.pages.map(p => p.name),
      curi: state.curi
    };
  },
  {
    addPage,
    showMessage
  }
)(AddPageControls);
