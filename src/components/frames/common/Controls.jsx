import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";

export default function Controls(props) {
  const {
    previous,
    next,
    nextText = "Next",
    cancel,
    error = false
  } = props;
  const prevButton = previous !== undefined ? (
    <NegButton text="Previous" click={previous} />
  ) : null;
  return (
    <div className="buttons">
      { prevButton }
      <PosButton text={nextText} type="submit" click={next} disabled={error} />
      <NegButton text="Cancel" click={cancel} />
    </div>
  );
}
