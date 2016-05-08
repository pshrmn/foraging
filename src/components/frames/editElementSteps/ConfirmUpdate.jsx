import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";
import { createElement } from "../../../helpers/page";
import { select } from "../../../helpers/selection";
import { highlight, unhighlight } from "../../../helpers/markup";
import { currentSelector } from "../../../constants/CSSClasses";

const ConfirmElement = React.createClass({
  saveHandler: function() {
    const { startData, next: save } = this.props;
    const { spec, optional } = startData;
    save({
      optional,
      spec
    });
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
        <h2>Confirm Updated Element</h2>
        <ul>
          <li>Selector: {selector}</li>
          <li>Spec: {JSON.stringify(spec, null, "\t")}</li>
          <li>Optional: {optional ? "Yes" : "No"}</li>
        </ul>
        <div className="buttons">
          <NegButton text="Previous" click={this.previousHandler} />
          <PosButton text="Update" click={this.saveHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  },
  componentWillMount: function() {
        const { startData, extraData } = this.props;

    const { selector, spec } = startData;
    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;
    const elements = select(
      parentMatches,
      startData.selector,
      spec,
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  },
  componentWillUnmount: function() {
    unhighlight(currentSelector);
  }
});

export default ConfirmElement;
