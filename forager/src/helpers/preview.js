import { integer, float } from 'helpers/parse';

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
    var allData = Array.from(elements)
      .map(ele => getElementData(element, ele))
      .filter(datum => datum !== undefined);
    return {
      [name]: allData
    };
  case 'range':
    /* eslint-disable no-redeclare */
    var { name, low, high } = element.spec;
    /* eslint-enable no-redeclare */
    var rangeData = Array.from(elements)
      .slice(low, high || undefined)
      .map(ele => getElementData(element, ele))
      .filter(datum => datum !== undefined);
    return {
      [name]: rangeData
    };
  }
};

/*
 * Get data for each rule and each child. Merge the child data into the
 * rule data. If either the rule data or child data is undefined (because
 * something required does not exist), return undefined. Otherwise returns
 * an object with the data for that element and its children.
 */
const getElementData = (element, domElement) => {
  const data = getRuleData(element.rules, domElement);
  if ( !data ) {
    return;
  }

  const childData = getChildData(element.children, domElement);
  if ( !childData ) {
    return;
  }
  return Object.assign({}, data, childData);
};

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
};

const getRuleData = (rules, domElement) => {
  let data = {};
  // break when some rule's attribute does not exist
  rules.some(rule => {
    let val;
    if ( rule.attr === 'text' ) {
      val = domElement.textContent.replace(/\s+/g, ' ');
    } else {
      var attr = domElement.getAttribute(rule.attr);
      if ( attr === null ) {
        data = undefined;
        return true;
      }
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
    return false;
  });
  return data;
};

export const preview = tree => tree === undefined ? '' : getElement(tree, document);

