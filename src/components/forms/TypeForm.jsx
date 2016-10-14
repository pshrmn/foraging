import React from 'react';

export default function TypeForm({ types, current, setType }) {

  const typeInputs = types.map(t => {
    const selected = current === t;
    return (
      <label
        key={t}
        className={selected ? 'selected': null}>
        <input
          type='radio'
          name='type'
          value={t}
          checked={selected}
          onChange={setType} />
        {t}
      </label>
    );
  });

  return (
    <div>
      <h3>
        Should the element target a single element or all?
      </h3>
      {typeInputs}
    </div>
  );
}

TypeForm.propTypes = {
  types: React.PropTypes.array,
  current: React.PropTypes.string,
  setType: React.PropTypes.func
};
