import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Wizard from 'simple-wizard-component';

import {
  Attribute,
  Type,
  Name,
  ConfirmSaveRule
} from 'components/steps/rule';
import Cycle from 'components/common/Cycle';

import { updatePage } from 'actions';
import { highlight, unhighlight} from 'helpers/markup';
import { currentSelector } from 'constants/CSSClasses';

const steps = [
  Attribute,
  Type,
  Name,
  ConfirmSaveRule
];

/*
 * Attribute -> Type -> Name -> ConfirmSaveRule
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
    const { page, element, updatePage, curi, response } = this.props;
    const newElement = {
      ...element,
      rules: [...element.rules, rule]
    };
    const newPage = {
      ...page,
      elements: page.elements.map(e => e.index === element.index ? newElement : e)
    };
    updatePage(newPage);

    const { name } = response.params;
    const pathname = curi.addons.pathname('Page', { name });
    curi.history.push({
      pathname,
      query: { element: element.index }
    });
  }

  cancel() {
    const { curi, response } = this.props;
    const { name } = response.params;
    const pathname = curi.addons.pathname('Page', { name });
    curi.history.push(pathname);
  }

  render() {
    const { element, page } = this.props;
    const { index } = this.state;
    return (
      <Wizard
        steps={steps}
        initialData={{}}
        staticData={{
          element,
          page,
          current: element.matches[index]
        }}
        save={this.save}
        cancel={this.cancel}
      >
        <Cycle
          index={index}
          count={element.matches.length}
          setIndex={this.setIndex}
        />
      </Wizard>
    );
  }

  componentDidMount() {
    const { element } = this.props;
    highlight(element.matches, currentSelector);
  }

  componentDidUpdate() {
    unhighlight(currentSelector);
    const { element } = this.props;
    highlight(element.matches, currentSelector);
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
  }
}

RuleWizard.propTypes = {
  element: PropTypes.object,
  page: PropTypes.object,
  curi: PropTypes.object,
  response: PropTypes.object,
  /* connect */
  updatePage: PropTypes.func.isRequired
};

export default connect(
  state => ({ curi: state.curi, response: state.response }),
  {
    updatePage
  }
)(RuleWizard);
