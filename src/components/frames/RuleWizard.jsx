import React from "react";
import { connect } from "react-redux";

import Wizard from "simple-wizard-component";

import ChooseAttribute from "./ruleSteps/ChooseAttribute";
import ChooseType from "./ruleSteps/ChooseType";
import ChooseName from "./ruleSteps/ChooseName";
import ConfirmRule from "./ruleSteps/ConfirmRule";

import { saveRule, showElementFrame } from "../../actions";

/*
 * ChooseAttribute -> ChooseType -> ChooseName -> ConfirmRule
 */
const RuleWizard = React.createClass({
  save: function(rule) {
    this.props.saveRule(rule);
  },
  cancel: function() {
    this.props.cancel();
  },
  render: function() {
    const { current } = this.props;
    const initialData = {
      current,
      index: 0
    };
    const steps = [
      ChooseAttribute,
      ChooseType,
      ChooseName,
      ConfirmRule
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
    saveRule,
    cancel: showElementFrame
  }
)(RuleWizard);
