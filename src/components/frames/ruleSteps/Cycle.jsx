import React from "react"

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
        <button onClick={this.previousElement}>
          {"<"}
        </button>
        {index} / {count-1}
        <button onClick={this.nextElement}>
          {">"}
        </button>
      </div>
    );
  }
});

export default Cycle;
