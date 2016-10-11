import React from 'react';

const SingleForm = ({index, count, setIndex}) => (
  <div>
    <h3>
      The element at which index should be selected?
    </h3>
    <select
      value={index}
      onChange={setIndex} >
      {
        Array.from(new Array(count))
          .map((u, i) => (<option key={i} value={i}>{i}</option>))
      }
    </select>
  </div>
);

export default SingleForm;
