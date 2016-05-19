import { integer, float } from './parse';

export const preview = tree => {
  /*
   * Given a parent element, get all children that match the selector
   * Return data based on element's type (index or name)
   */
  const getElement = (element, parent) => {
    const elements = parent.querySelectorAll(element.selector);
    const { type } = element.spec;

    switch ( type ) {
    case 'single':
      var { index } = element.spec;
      var ele = elements[index];
      if ( !ele) {
        return;
      }
      return getElementData(element, ele);
    case 'all':
      var { name } = element.spec;
      var data = Array.from(elements)
        .map(ele => getElementData(element, ele))
        .filter(datum => datum !== undefined);
      return {
        [name]: data
      }
    case 'range':
      var { name, low, high } = element.spec;
      var data = Array.from(elements)
        .slice(low, high || undefined)
        .map(ele => getElementData(element, ele))
        .filter(datum => datum !== undefined);
      return {
        [name]: data
      };
    }
  }

  /*
   * Get data for each rule and each child. Merge the child data into the
   * rule data.
   */
  const getElementData = (element, domElement) => {
    const data = getRuleData(element.rules, domElement);
    const childData = getChildData(element.children, domElement);
    if ( !childData ) {
      return;
    }
    return Object.assign({}, data, childData);
  }

  const getChildData = (children, domElement) => {
    let data = {};
    // iterate through the children until one fails
    children.some(child => {
      const childData = getElement(child, domElement);
      // when some child data does not exist, clear the lot
      if ( !childData && !child.optional ) {
        data = undefined;
        return true;
      }
      for ( const key in childData ) {
        data[key] = childData[key];
      }
      return false;
    });
    return data;
  }

  const getRuleData = (rules, domElement) => {
    const data = {};
    rules.forEach(rule => {
      let val;
      let match;
      if ( rule.attr === 'text' ) {
        val = domElement.textContent.replace(/\s+/g, ' ');
      } else {
        var attr = domElement.getAttribute(rule.attr);
        // attributes that don't exist will return null
        // just use empty string for now
        val = attr || '';
      }
      switch (rule.type) {
      case 'int':
        val = integer(val);
        break;
      case 'float':
        val = float(val);
        break;
      }
      data[rule.name] = val;
    });
    return data;
  }

  return tree === undefined ? '' : getElement(tree, document);
}

