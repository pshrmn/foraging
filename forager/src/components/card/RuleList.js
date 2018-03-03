import React from 'react';
import PropTypes from 'prop-types';

import Rule from './Rule';

const RuleList = ({ rules, params }) => (
  !rules.length
    ? null
    : <ul className='rules'>
      { rules.map((r,i) => (
        <Rule
          key={i}
          index={i}
          params={params}
          {...r}
        />
      ))}
    </ul>
);

RuleList.propTypes = {
  rules: PropTypes.array,
  params: PropTypes.object
};

export default RuleList;
