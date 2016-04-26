import React from "react";
import { connect } from "react-redux";

import Wizard from "simple-wizard-component";

import ChooseElements from "./elementSteps/ChooseElements";
import ChooseParts from "./elementSteps/ChooseParts";
import ChooseType from "./elementSteps/ChooseType";
import ChooseValue from "./elementSteps/ChooseValue";
import ChooseOptional from "./elementSteps/ChooseOptional";
import ConfirmElement from "./elementSteps/ConfirmElement";

import { saveElement, showElementFrame } from "../../actions";

/*
 * ChooseElements -> ChooseParts -> ChooseType ->
 *   ChooseValue -> ChooseOptional -> ConfirmElement
 * each step should make sure to pass the current object (the currently
 * selected element selector) as a property of the object returned
 * in its next call
 */
const ElementWizard = React.createClass({
  save: function(ele) {
    this.props.saveElement(ele);
  },
  cancel: function() {
    this.props.cancel();
  },
  render: function() {
    const { current } = this.props;
    const initialData = {
      current
    };
    const steps = [
      ChooseElements,
      ChooseParts,
      ChooseType,
      ChooseValue,
      ChooseOptional,
      ConfirmElement
    ];
    return (
      <Wizard steps={steps}
              initialData={initialData}
              save={this.save}
              cancel={this.cancel} />
    );
  }
});

export default connect(
  state => {
    const { page } = state;
    const { pages, pageIndex, elementIndex } = page;

    const currentPage = pages[pageIndex];
    const element = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
    return {
      current: element
    };
  },
  {
    saveElement,
    cancel: showElementFrame
  }
)(ElementWizard);
