import React from 'react';
import PropTypes from 'prop-types';

export default function AllForm(props) {
  const { name, setName } = props;
  return (
    <div>
      <h3>
        What should the array of elements be named?
      </h3>
      <input
        type='text'
        placeholder='e.g., names'
        value={name}
        onChange={setName} />
    </div>
  );
}

AllForm.propTypes = {
  name: PropTypes.string,
  setName: PropTypes.func
};
