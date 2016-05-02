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

  const {
    type = "single",
    value = 0
  } = spec;

  let description = "";
  if ( type === "single" ) {
    description = `captures element at index ${value}`;
  } else if ( type === "all" ) {
    description = `captures all elements, groups them as "${value}"`;
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
