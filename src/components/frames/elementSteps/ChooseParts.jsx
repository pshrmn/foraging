import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";

import { select, count } from "../../../helpers/selection";
import { highlight, unhighlight} from "../../../helpers/markup";
import { queryCheck } from "../../../constants/CSSClasses";

function joinParts(parts) {
  return parts.reduce((str, curr) => {
    if ( curr.checked ) {
      str += curr.name;
    }
    return str;
  }, "");
}

const ChooseParts = React.createClass({
  getInitialState: function() {
    return {
      parts: [],
      eleCount: 0,
      error: true
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { parts } = this.state;
    const { next, startData } = this.props;
    const selector = joinParts(parts);
    if ( selector !== "" ) {
      next({
        selector,
        current: startData.current
      });
    } else {
      this.setState({
        error: true
      });
    }
  },
  previousHander: function(event) {
    event.preventDefault();
    this.props.previous();
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  toggleRadio: function(event) {
    // don't prevent default
    const index = event.target.value;
    const parts = this.state.parts;
    parts[index].checked = !parts[index].checked;
    const fullSelector = joinParts(parts);

    this._setupHighlights(fullSelector);
    const { startData } = this.props;
    this.setState({
      parts: parts,
      eleCount: fullSelector === "" ? 0 : count(startData.current.elements, fullSelector),
      error: fullSelector === ""
    });
  },
  componentWillMount: function() {
    const { startData } = this.props;
    const { parts, current } = startData;

    const fullSelector = parts.join("");
    this._setupHighlights(fullSelector);

    this.setState({
      parts: parts.map(name => ({name: name, checked: true})),
      eleCount: count(current.elements, fullSelector),
      error: false
    });
  },
  render: function() {
    const { parts, eleCount, error } = this.state;
    const opts = parts.map((part, index) => {
      const { name, checked } = part;
      return (
        <label key={index}
               className={checked ? "selected" : ""}>
          {name}
          <input type="checkbox"
                 name="selector-part"
                 value={index}
                 checked={checked}
                 onChange={this.toggleRadio} />
        </label>
      );
    });
    return (
      <div className="info-box">
        <div className="info">
          <h3>Select Relevant Part(s) of the CSS selector</h3>
          <div className="choices">
            {opts}
          </div>
          <h5>Count: {this.state.eleCount}</h5>
        </div>
        <div className="buttons">
          <NegButton text="Previous" click={this.previousHander} />
          <PosButton text="Next" disabled={error} click={this.nextHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  },
  componentWillUnmount: function() {
    unhighlight(queryCheck);
  },
  _setupHighlights: function(cssSelector) {
    unhighlight(queryCheck);
    if ( cssSelector !== "" ) {
      const { startData } = this.props;
      const elements = select(startData.current.elements, cssSelector, null, '.forager-holder');
      highlight(elements, queryCheck);
    }
  }
});

export default ChooseParts;
