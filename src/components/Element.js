import React from 'react';
import PropTypes from 'prop-types';

import Rule from 'components/Rule';

import { describeSpec } from 'helpers/text';

function Element(props) {
  const {
    selector,
    rules,
    spec,
    optional = false,
    params
  } = props;

  return (
    <div className='element'>
      <div>
        <span className='big bold'>{selector}{optional ? <span title='optional'>*</span> : null}</span>
      </div>
      <div>
        {describeSpec(spec)}
      </div>
      <RuleList rules={rules} params={params} />
    </div>
  );
}

Element.propTypes = {
  selector: PropTypes.string.isRequired,
  rules: PropTypes.array,
  spec: PropTypes.object,
  optional: PropTypes.bool,
  params: PropTypes.object
};

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

export default Element;
