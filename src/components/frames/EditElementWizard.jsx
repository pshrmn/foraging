import React from "react";
import { connect } from "react-redux";

import Wizard from "simple-wizard-component";
import Tree from "../Tree";

import ChooseType from "./editElementSteps/ChooseType";
import ChooseValue from "./editElementSteps/ChooseValue";
import ChooseOptional from "./editElementSteps/ChooseOptional";
import ConfirmUpdate from "./editElementSteps/ConfirmUpdate";

import { updateElement, showElementFrame } from "../../actions";

/*
 * ChooseType -> ChooseValue -> ChooseOptional -> ConfirmUpdate
 * each step should make sure to pass the current object (the currently
 * selected element selector) as a property of the object returned
 * in its next call
 */
const EditElementWizard = React.createClass({
  save: function(newProps) {
    const { current, updateElement } = this.props;
    const { spec, optional } = newProps;
    updateElement(current.index, {
      spec,
      optional
    });
  },
  cancel: function() {
    this.props.cancel();
  },
  render: function() {
    const { current, parent } = this.props;
    const { selector, spec, optional } = current;
    const initialData = {
      selector,
      spec,
      optional
    };
    const extraData = {
      parent
    };
    const steps = [
      ChooseType,
      ChooseValue,
      ChooseOptional,
      ConfirmUpdate
    ];
    return (
      <div className="frame">
        <Tree />
        <Wizard steps={steps}
                initialData={initialData}
                extraData={extraData}
                save={this.save}
                cancel={this.cancel} />
      </div>
    );
  }
});

export default connect(
  state => {
    const { page } = state;
    const { pages, pageIndex, elementIndex } = page;

    const currentPage = pages[pageIndex];
    const current = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
    const parent = current === undefined ? undefined : currentPage.elements[current.parent];
    return {
      current,
      parent
    };
  },
  {
    updateElement,
    cancel: showElementFrame
  }
)(EditElementWizard);
