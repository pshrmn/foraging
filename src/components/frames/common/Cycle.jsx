import React from "react"

import { NeutralButton } from "../../common/Buttons";

const Cycle = React.createClass({
  previousElement: function() {
    const { setIndex, index, count } = this.props;
    // add length then modulus because javascript mod negative stays negative
    const prev = ((index - 1) + count) % count;
    setIndex(prev);
  },
  nextElement: function() {
    const { setIndex, index, count } = this.props;
    const next = (index + 1) % count;
    setIndex(next);
  },
  render: function() {
    const { index, count } = this.props;
    return (
      <div>
        <NeutralButton
          onClick={this.previousElement}
          text="<" />
        {index + 1} / {count}
        <NeutralButton
          onClick={this.nextElement}
          text=">" />
      </div>
    );
  }
});

export default Cycle;
