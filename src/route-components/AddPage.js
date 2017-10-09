import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, curious } from '@curi/react';

import { addPage } from 'actions';
import { createElement } from 'helpers/page';

class AddPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', allowed: false };
  }

  handleName = (event) => {
    const name = event.target.value;
    this.setState({
      name,
      allowed: name !== '' && this.props.takenNames.every(n => n !== name)
    });
  }

  addPage = () => {
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
    const { name, allowed } = this.state;
    return (
      <div className='frame'>
        <h1>Add a new page</h1>
        <form>
          <label>
            {'Name '}
            <input type='text' value={name} onChange={this.handleName} />
          </label>
          {
            allowed || name === ''
              ? null
              : <p className='warning'>This name is already in use.</p>
          }
          <button type='button' onClick={this.addPage}>Add Page</button>
          <Link to='Home' anchor='button' className='neg'>Cancel</Link>
        </form>
      </div>
    );
  }
}

AddPage.propTypes = {
  /* curious */
  curi: PropTypes.object,
  /* connect */
  takenNames: PropTypes.array,
  addPage: PropTypes.func
};

export default curious(connect(
  state => {
    return {
      takenNames: state.pages.map(p => p.name)
    };
  },
  {
    addPage
  }
)(AddPage));
