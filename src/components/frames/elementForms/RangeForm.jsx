import React from "react";

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

  
  const lowOptions = Array.from(new Array(count)).map((u, i) => {
    return (
      <option key={i} value={i}>{i}</option>
    );
  });
  const lowSelect = (
    <select value={low} onChange={setLow}>
      {lowOptions}
    </select>
  );

  const highOptions = Array.from(new Array(count)).map((u, i) => {
    return (
      <option key={i} value={i}>{i}</option>
    );
  });

  const highSelect = (
    <select value={high} onChange={setHigh}>
      {highOptions.concat([<option key="end" value="end">end</option>])}
    </select>
  );



  return (
    <div>
      <h3>
        What should the array of elements be named?
      </h3>
      <input type="text"
             placeholder="e.g., names"
             value={name}
             onChange={setName} />

      <h3>
        Which elements should be selected?
      </h3>
      {lowSelect} - {highSelect}
    </div>
  );
}