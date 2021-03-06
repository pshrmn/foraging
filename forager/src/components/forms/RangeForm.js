import React from 'react';
import PropTypes from 'prop-types';

export default function RangeForm(props) {
  const {
    name,
    low,
    high,
    count,
    setName,
    setLow,
    setHigh
  } = props;

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
      <h3>
        Which elements should be selected?
      </h3>
      <select value={low} onChange={setLow}>
        {
          Array.from(new Array(count))
            .map((u, i) => (<option key={i} value={i}>{i}</option>))
        }
      </select>
      {' - '}
      <select value={high} onChange={setHigh}>
        {
          Array.from(new Array(count))
            .map((u, i) => (<option key={i} value={i}>{i}</option>))
        }
        <option key='end' value='end'>end</option>
      </select>
    </div>
  );
}

RangeForm.propTypes = {
  name: PropTypes.string,
  low: PropTypes.number,
  high: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  count: PropTypes.number,
  setName: PropTypes.func,
  setLow: PropTypes.func,
  setHigh: PropTypes.func
};
