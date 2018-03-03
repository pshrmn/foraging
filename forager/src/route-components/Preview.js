import React from 'react';
import PropTypes from 'prop-types';

const Preview = ({ data }) => (
  <div className='frame'>
    <div className='preview'>
      <pre>{JSON.stringify(data.tree, null, 2)}</pre>
    </div>
  </div>
);

Preview.propTypes = {
  data: PropTypes.object,
};

export default Preview;
