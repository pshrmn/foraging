import React from 'react';

export default function SingleForm(props) {

  const {
    index,
    count,
    setIndex
  } = props;

  const options = Array.from(new Array(count)).map((u, i) => {
      return (
        <option key={i} value={i}>{i}</option>
      );
    });

  return (
    <div>
      <h3>
        The element at which index should be selected?
      </h3>
      <select
        value={index}
        onChange={setIndex} >
        {options}
      </select>
    </div>
  );
}
