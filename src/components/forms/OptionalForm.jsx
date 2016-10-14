import React from 'react';

const OptionalForm = ({ optional, toggle }) => (
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

OptionalForm.propTypes = {
  optional: React.PropTypes.bool,
  toggle: React.PropTypes.func
};

export default OptionalForm;
