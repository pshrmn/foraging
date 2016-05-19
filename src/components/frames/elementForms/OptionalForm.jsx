import React from 'react';

export default function OptionalForm(props) {
  const { optional, toggle } = props;
  return (
    <div>
      <h3>
        Is this element optional?
      </h3>
      <label className={optional ? 'selected' : null}>
        <input
          type='checkbox'
          checked={optional}
          onChange={toggle} />
        { optional ? 'Yes' : 'No' }
      </label>
    </div>
  );
}
