import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@curi/react';
import { connect } from 'react-redux';

import { addPage } from 'actions';
import { createElement } from 'helpers/page';


class AddPageControls extends React.Component {

  state = { name: '', allowed: true };

  handleName = (event) => {
    const name = event.target.value;
    this.setState({
      name,
      allowed: name !== '' && this.props.takenNames.every(n => n !== name)
    });
  }

  addPage = (event) => {
    event.preventDefault();
    const { curi, addPage } = this.props;
    const { name, allowed } = this.state;

    if (!allowed) {
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
    const { allowed, name } = this.state;
    return  ([
      <input
        key='input'
        type='text'
        value={name}
        onChange={this.handleName}
        placeholder='Add a new page'
      />,
      allowed || name === ''
        ? null
        : <span key='warning' className='message neg'>This name is already in use.</span>,
      <button key='submit' type='button' onClick={this.addPage}>Add Page</button>,
      <Link key='cancel' to='Home' anchor='button' className='neg'>Cancel</Link>,
    ]);
  }
}

AddPageControls.propTypes = {
  /* connect */
  curi: PropTypes.object,
  takenNames: PropTypes.array,
  addPage: PropTypes.func
};

export default connect(
  state => {
    return {
      takenNames: state.pages.map(p => p.name),
      curi: state.curi
    };
  },
  {
    addPage
  }
)(AddPageControls);
