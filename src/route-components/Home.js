import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@curi/react';

const Home = ({ pages }) => (
  <div className='frame'>
    <section>
      <h2>Pages</h2>
      <ul>
        {
          pages.map(page => (
            <li key={page.name}>
              <Link to='Page' params={{ name: page.name }}>{page.name}</Link>
            </li>
          ))
        }
      </ul>
      <Link to='Add Page' anchor='button' className='pos'>Add a page</Link>
    </section>
  </div>
);

Home.propTypes = {
  pages: PropTypes.array
};

export default connect(
  state => ({ pages: state.page.pages })
)(Home);
