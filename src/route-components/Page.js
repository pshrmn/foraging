import React from 'react';
import PropTypes from 'prop-types';

import Tree from 'components/tree/Tree';
import ElementCard from 'components/ElementCard';
import PageControls from 'components/PageControls';

const Page = ({ params }) => {
  return (
    <div className='frame'>
      <h1>Page {params.name}</h1>
      <PageControls params={params} />
      <div className='content'>
        <Tree />
        <ElementCard />
      </div>
    </div>
  );
};

Page.propTypes = {
  params: PropTypes.object.isRequired
};

export default Page;
