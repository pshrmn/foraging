import React from 'react';

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
  name: React.PropTypes.string,
  low: React.PropTypes.number,
  high: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  count: React.PropTypes.number,
  setName: React.PropTypes.func,
  setLow: React.PropTypes.func,
  setHigh: React.PropTypes.func
};
