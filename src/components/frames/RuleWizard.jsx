import React from "react";
import { connect } from "react-redux";

import Wizard from "simple-wizard-component";

import ChooseAttribute from "./ruleSteps/ChooseAttribute";
import ChooseType from "./ruleSteps/ChooseType";
import ChooseName from "./ruleSteps/ChooseName";
import ConfirmRule from "./ruleSteps/ConfirmRule";

import Cycle from "./ruleSteps/Cycle";
import { saveRule, showElementFrame } from "../../actions";
import { highlight, unhighlight} from "../../helpers/markup";
import { currentSelector } from "../../constants/CSSClasses";

/*
 * ChooseAttribute -> ChooseType -> ChooseName -> ConfirmRule
 *
 * The RuleWizard is used to create a rule for an element. A Cycle is
 * used to cycle through the DOM elements that the element matches while
 * creating the rule.
 */
const RuleWizard = React.createClass({
  getInitialState: function() {
    return {
      index: 0
    };
  },
  setIndex: function(index) {
    this.setState({
      index
    });
  },
  save: function(rule) {
    this.props.saveRule(rule);
  },
  cancel: function() {
    this.props.cancel();
  },
  render: function() {
    const { current } = this.props;
    const { index } = this.state;

    const initialData = {};
    const extraData = {
      element: current.matches[index]
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
              extraData={extraData}
              save={this.save}
              cancel={this.cancel}>
        <Cycle index={index}
               count={current.matches.length}
               setIndex={this.setIndex} />
      </Wizard>
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
