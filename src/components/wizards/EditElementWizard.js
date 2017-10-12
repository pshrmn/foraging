import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Wizard from 'simple-wizard-component';
import {
  EditValue as Value,
  EditOptional as Optional,
  EditType as Type,
  ConfirmUpdate
} from 'components/steps/element';
import { select } from 'helpers/selection';
import { updatePage } from 'actions';
//import { currentElement, currentParent } from 'helpers/store';

const steps = [
  Type,
  Value,
  Optional,
  ConfirmUpdate
];

/*
 * Type -> Value -> Optional -> ConfirmUpdate
 * each step should make sure to pass the current object (the currently
 * selected element selector) as a property of the object returned
 * in its next call
 */
class EditElementWizard extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  save(newProps) {
    const { curi, response, updatePage, page, element } = this.props;

    const newElement = {
      ...element,
      ...newProps
    };

    const parentIndex = element.parent && page.elements[element.parent];
    const parent = parentIndex != null ? page.elements[parentIndex]: {};
    const parentElements = parent ? parent.matches : [document];
    newElement.matches = select(parentElements, newElement.selector, newElement.spec, '.forager-holder');

    const newPage = {...page};

    newPage.elements[newElement.index] = newElement;

    // TODO?: reselect children. Probably implement a "reselect" function to chain this. Currently, this
    // is being done by the "selectMiddleware", but maybe it should be done here instead...

    updatePage(newPage);
    const { name } = response.params;
    const pathname = curi.addons.pathname('Page', { name });
    curi.history.push({
      pathname,
      query: { element: newElement.index }
    });
  }

  cancel() {
    const { curi, response, element } = this.props;
    const { name } = response.params;
    const pathname = curi.addons.pathname('Page', { name });
    curi.history.push({
      pathname,
      query: { element: element.index }
    });
  }

  render() {
    const { element, page } = this.props;
    const parent = element.parent != null ? page.elements[element.parent] : {};
    const { selector, spec, optional } = element;
    return (
      <Wizard
        steps={steps}
        initialData={{
          selector,
          spec,
          optional
        }}
        staticData={{
          parent,
          originalSpec: spec
        }}
        save={this.save}
        cancel={this.cancel}
      />
    );
  }
}

EditElementWizard.propTypes = {
  element: PropTypes.object,
  page: PropTypes.object,
  /* connect */
  updatePage: PropTypes.func.isRequired,
  curi: PropTypes.object,
  response: PropTypes.object
};

export default connect(
  state => ({ curi: state.curi, response: state.response }),
  {
    updatePage
  }
)(EditElementWizard);
