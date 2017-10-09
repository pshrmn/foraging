import { levelNames } from 'helpers/page';

/*
 * returns the currently selected element
 */
export function currentElement(state) {
  const page = currentPage(state);
  const { response } = state;
  const index = parseInt(response.params.index, 10);
  return page && page.elements[index];
}

/*
 * returns the parent element of the currently selected element
 * or undefined if either the current element does not exist
 */
export function currentParent(state) {
  const page = currentPage(state);
  const element = currentElement(state);
  return element && page.elements[element.parent];
}

/*
 * return a list of names for all elements in the same level as
 * the current element
 */
export function takenNames(state) {
  const currentEle = currentElement(state);
  const index = currentEle != null ? currentEle.parent : null;
  if (index === null) {
    return [];
  }
  const page = currentPage(state);
  const currentPageElements = page.elements;
  return levelNames(currentPageElements, index);
}

export function currentPage(state) {
  const { page, response } = state;
  const { name } = response.params;
  if (!name) {
    return;
  }
  return page.pages.find(p => p.name === name);
}