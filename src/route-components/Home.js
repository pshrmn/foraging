import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@curi/react';

const Home = ({ pages }) => (
  <div className='frame'>
    <section className='tile red'>
      <h2>Saved Pages</h2>
      <ul className='long'>
        {
          pages.map(page => (
            <li key={page.name}>
              <Link to='Page' params={{ name: page.name }}>{page.name}</Link>
            </li>
          ))
        }
      </ul>
      <Link to='Add Page' anchor='button'>Add a page</Link>
    </section>
    <section className='tile gold'>
      <h2>Help</h2>
      <ul>
        <li>
          <a href='https://www.pshrmn.com/tutorials/forager/'>Tutorial</a>
        </li>
        <li>
          <a href='https://github.com/pshrmn/forager'>GitHub Repo</a>
        </li>
      </ul>
    </section>
  </div>
);

Home.propTypes = {
  pages: PropTypes.array
};

export default connect(
  state => ({ pages: state.pages })
)(Home);
