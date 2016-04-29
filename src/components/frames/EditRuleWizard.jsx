import React from "react";
import { connect } from "react-redux";

import Wizard from "simple-wizard-component";

import ChooseAttribute from "./ruleSteps/ChooseAttribute";
import ChooseType from "./ruleSteps/ChooseType";
import ChooseName from "./ruleSteps/ChooseName";
import ConfirmUpdateRule from "./ruleSteps/ConfirmUpdateRule";

import { updateRule, showElementFrame } from "../../actions";
import { highlight, unhighlight} from "../../helpers/markup";
import { currentSelector } from "../../constants/CSSClasses";

/*
 * ChooseAttribute -> ChooseType -> ChooseName -> ConfirmRule
 */
const EditRuleWizard = React.createClass({
  save: function(rule) {
    const { updateRule, ruleIndex } = this.props;
    updateRule(ruleIndex, rule);
  },
  cancel: function() {
    this.props.cancel();
  },
  render: function() {
    const { current, ruleIndex } = this.props;
    // make sure that the rule exists
    const rule = current.rules[ruleIndex];
    if ( ruleIndex === undefined || ruleIndex === undefined) {
      return null;
    }

    const { name, attr, type } = rule;
    const initialData = {
      current,
      index: 0,
      name,
      attr,
      type
    };
    const steps = [
      ChooseAttribute,
      ChooseType,
      ChooseName,
      ConfirmUpdateRule
    ];
    return (
      <Wizard steps={steps}
              initialData={initialData}
              save={this.save}
              cancel={this.cancel} />
    );
  },
  componentWillMount: function() {
    const { current } = this.props;
    highlight(current.matches, currentSelector);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(currentSelector);
    const { current } = this.props;
    highlight(current.matches, currentSelector);
  },
  componentWillUnmount: function() {
    unhighlight(currentSelector);
  }
});

export default connect(
  state => {
    const { page, frame } = state;
    const { pages, pageIndex, elementIndex } = page;

    const currentPage = pages[pageIndex];
    const current = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
    return {
      current,
      ruleIndex: frame.index
    };
  },
  {
    updateRule,
    cancel: showElementFrame
  }
)(EditRuleWizard);
