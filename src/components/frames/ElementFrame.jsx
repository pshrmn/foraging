import React from "react";

export default React.createClass({
  render: function() {
    return (
      <div className="frame element-form">
        <h2>{selector}</h2>
        <p>{description}</p>
      </div>
    );
  }
});
