import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { curious } from '@curi/react';

import Wizard from 'simple-wizard-component';
import {
  Elements,
  Parts,
  CreateType as Type,
  CreateValue as Value,
  CreateOptional as Optional,
  ConfirmElement
} from 'components/steps/element';

import { updatePage } from 'actions';
import { highlight, unhighlight} from 'helpers/markup';
import { select } from 'helpers/selection';
import { currentSelector } from 'constants/CSSClasses';

const steps = [
  Elements,
  Parts,
  Type,
  Value,
  Optional,
  ConfirmElement
];

/*
 * Elements -> Parts -> Type -> Value -> Optional -> ConfirmElement
 * each step should make sure to pass the current object (the currently
 * selected element selector) as a property of the object returned
 * in its next call
 */
class ElementWizard extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  save(ele) {
    const { curi, response, updatePage, page, parent } = this.props;

    // more setup
    ele.parent = parent.index;
    ele.index = page.elements.length;
    page.elements.push(ele);

    const parentElements = parent ? [document] : parent.matches;
    ele.matches = select(parentElements, ele.selector, ele.spec, '.forager-holder');

    updatePage(page);
    const { name } = response.params;
    const pathname = curi.addons.pathname('Page', { name });
    curi.history.push({
      pathname,
      query: { element: ele.index }
    });
  }

  cancel() {
    const { curi, response } = this.props;
    const { name } = response.params;
    const pathname = curi.addons.pathname('Page', { name });
    curi.history.push(pathname);
  }

  render() {
    const { parent } = this.props;

    return (
      <Wizard
        steps={steps}
        initialData={{}}
        staticData={{
          parent
        }}
        save={this.save}
        cancel={this.cancel}
      />
    );
  }

  componentDidMount() {
    const { parent } = this.props;
    highlight(parent.matches, currentSelector);
  }

  componentDidUpdate() {
    unhighlight(currentSelector);
    const { parent } = this.props;
    highlight(parent.matches, currentSelector);
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
  }
}

ElementWizard.propTypes = {
  parent: PropTypes.object,
  page: PropTypes.object,
  /* curious */
  curi: PropTypes.object,
  response: PropTypes.object,
  /* connect */
  updatePage: PropTypes.func.isRequired,
};

export default curious(connect(
  null,
  {
    updatePage
  }
)(ElementWizard));
