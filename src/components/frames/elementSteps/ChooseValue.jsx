import React from "react";

import AllValueStep from "./AllValueStep";
import SingleValueStep from "./SingleValueStep";

export default function ChooseValue(props) {
  const { startData } = props;
  const { spec } = startData;
  switch ( spec.type ) {
  case "all":
    return <AllValueStep {...props} />
  case "single":
    return <SingleValueStep {...props} />
  }
}
