import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";
import { createElement } from "../../../helpers/page";
import { select } from "../../../helpers/selection";
import { highlight, unhighlight } from "../../../helpers/markup";
import { queryCheck } from "../../../constants/CSSClasses";

const ConfirmElement = React.createClass({
  saveHandler: function() {
    const { startData, next: save } = this.props;
    const { current, selector, spec, optional } = startData;
    const ele = createElement(selector, spec, optional);
    save(ele);
  },
  previousHandler: function(event) {
    event.preventDefault();
    this.props.previous();
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  render: function() {
    const { startData } = this.props;
    const { selector, spec, optional } = startData;
    return (
      <div className="info-box">
        <h2>Confirm Element</h2>
        <ul>
          <li>Selector: {selector}</li>
          <li>Spec: {JSON.stringify(spec, null, "\t")}</li>
          <li>Optional: {optional ? "Yes" : "No"}</li>
        </ul>
        <div className="buttons">
          <NegButton text="Previous" click={this.previousHandler} />
          <PosButton text="Save" click={this.saveHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  },
  componentWillMount: function() {
    const { startData } = this.props;
    const { current, selector, spec } = startData;
    const elements = select(current.matches, selector, spec, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUnmount: function() {
    unhighlight(queryCheck);
  }
});

export default ConfirmElement;
