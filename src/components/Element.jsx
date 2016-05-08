import React from "react";

import Rule from "./Rule";

function Element(props) {
  const {
    selector,
    rules,
    spec,
    optional = false,
    active = true
  } = props;

  const { type = "single" } = spec;

  let description = "";
  if ( type === "single" ) {
    const { index = 0 } = spec;
    description = `captures element at index ${index}`;
  } else if ( type === "all" ) {
    const { name = "" } = spec;
    description = `captures all elements, groups them as "${name}"`;
  } else if ( type === "range" ) {
    const { name = "", low, high } = spec;
    const lowText = low === undefined ? "start" : low;
    const highText = high === null ? "end" : high;
    description = `captures elements ${lowText} to ${highText}, groups them as "${name}"`;
  }

  return (
    <div className="element">
      <div>
        <span className="big bold">{selector}{optional ? <span title="optional">*</span> : null}</span>
      </div>
      <div>
        {description}
      </div>
      <RuleList rules={rules} active={active} />
    </div>
  );
}

function RuleList(props) {
  const { rules, active } = props;
  if ( !rules.length ) {
    return null;
  }
  return (
    <ul className="rules">
      {
        rules.map((r,i) => {
          return <Rule key={i}
                       index={i}
                       active={active}
                       {...r}/>;
        })
      }
    </ul>
  );
}

export default Element;
