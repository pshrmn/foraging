import React from 'react';
import { connect } from 'react-redux';

import Wizard from 'simple-wizard-component';
import ElementCard from 'components/ElementCard';
import {
  Attribute,
  Type,
  Name,
  ConfirmRule
} from 'components/steps/rule';
import Cycle from 'components/common/Cycle';

import { saveRule, showElementFrame } from 'actions';
import { highlight, unhighlight} from 'helpers/markup';
import { currentElement } from 'helpers/store';
import { currentSelector } from 'constants/CSSClasses';

const steps = [
  Attribute,
  Type,
  Name,
  ConfirmRule
];

/*
 * ttribute -> Type -> Name -> ConfirmRule
 *
 * The RuleWizard is used to create a rule for an element. A Cycle is
 * used to cycle through the DOM elements that the element matches while
 * creating the rule.
 */
class RuleWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
    this.setIndex = this.setIndex.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  setIndex(index) {
    this.setState({
      index
    });
  }

  save(rule) {
    this.props.saveRule(rule);
  }

  cancel() {
    this.props.cancel();
  }

  render() {
    const { current } = this.props;
    const { index } = this.state;
    return (
      <div className='frame'>
        <ElementCard active={false} element={current} />
        <Wizard steps={steps}
                initialData={{}}
                staticData={{
                  element: current.matches[index]
                }}
                save={this.save}
                cancel={this.cancel}>
          <Cycle index={index}
                 count={current.matches.length}
                 setIndex={this.setIndex} />
        </Wizard>
      </div>
    );
  }

  componentWillMount() {
    const { current } = this.props;
    highlight(current.matches, currentSelector);
  }

  componentWillUpdate(nextProps) {
    unhighlight(currentSelector);
    const { current } = nextProps;
    highlight(current.matches, currentSelector);
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
  }
}

RuleWizard.propTypes = {
  saveRule: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired,
  current: React.PropTypes.object
};

export default connect(
  state => {
    const { page } = state;
    return {
      current: currentElement(page)
    };
  },
  {
    saveRule,
    cancel: showElementFrame
  }
)(RuleWizard);
