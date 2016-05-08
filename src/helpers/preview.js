import { integer, float } from "./parse";

export const preview = tree => {
  /*
   * Given a parent element, get all children that match the selector
   * Return data based on element's type (index or name)
   */
  const getElement = (element, parent) => {
    const elements = parent.querySelectorAll(element.selector);
    const { type } = element.spec;
    switch ( type ) {
    case "single":
      const { index } = element.spec;
      var ele = elements[index];
      if ( !ele) {
        return;
      }
      return getElementData(element, ele);
    case "all":
      const { name } = element.spec;
      var data = Array.from(elements).map(function(ele){
        return getElementData(element, ele);
      }).filter(function(datum){
        return datum !== undefined;
      });
      var obj = {};
      obj[name] = data;
      return obj;
    }
  }

  /*
   * Get data for each rule and each child. Merge the child data into the
   * rule data.
   */
  const getElementData = (element, htmlElement) => {
    const data = getRuleData(element.rules, htmlElement);
    const childData = getChildData(element.children, htmlElement);
    if ( !childData ) {
      return;
    }
    for ( const key in childData ) {
      data[key] = childData[key];
    }
    return data;
  }

  const getChildData = (children, htmlElement) => {
    let data = {};
    children.some(function(child){
      const childData = getElement(child, htmlElement);
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

  const getRuleData = (rules, htmlElement) => {
    const data = {};
    rules.forEach(function(rule){
      let val;
      let match;
      if ( rule.attr === "text" ) {
         val = htmlElement.textContent.replace(/\s+/g, " ");
      } else {
        var attr = htmlElement.getAttribute(rule.attr);
        // attributes that don't exist will return null
        // just use empty string for now
        val = attr || "";
      }
      switch (rule.type) {
      case "int":
        val = integer(val);
        break;
      case "float":
        val = float(val);
        break;
      }
      data[rule.name] = val;
    });
    return data;
  }

  return tree === undefined ? "" : getElement(tree, document);
}

