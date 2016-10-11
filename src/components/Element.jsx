import React from 'react';

import Rule from 'components/Rule';

import { describeSpec } from 'helpers/text';

function Element(props) {
  const {
    selector,
    rules,
    spec,
    optional = false,
    active = true
  } = props;

  return (
    <div className='element'>
      <div>
        <span className='big bold'>{selector}{optional ? <span title='optional'>*</span> : null}</span>
      </div>
      <div>
        {describeSpec(spec)}
      </div>
      <RuleList rules={rules} active={active} />
    </div>
  );
}

const RuleList = ({ rules, active }) => (
  !rules.length ? null : (
    <ul className='rules'>
      {
        rules.map((r,i) => (
          <Rule
            key={i}
            index={i}
            active={active}
            {...r} />
        ))
      }
    </ul>
  )
);

export default Element;
