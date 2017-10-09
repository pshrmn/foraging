import { levelNames } from 'helpers/page';

/*
 * returns the currently selected element
 */
export function currentElement(page, index) {
  const { pages, current } = page;
  const currentPage = pages.find(p => p.name === current);
  return currentPage && currentPage.elements[index];
}

/*
 * returns the parent element of the currently selected element
 * or undefined if either the current element does not exist
 */
export function currentParent(page) {
  const { pages, current, elementIndex } = page;
  const currentPage = pages.find(p => p.name === current);
  const currentElement = currentPage && currentPage.elements[elementIndex];
  return currentElement && currentPage.elements[currentElement.parent];
}

/*
 * return a list of names for all elements in the same level as
 * the current element
 */
export function takenNames(page) {
  const { pages, current, elementIndex } = page;
  const currentEle = currentElement(page);
  const index = currentEle !== null ? currentEle.parent : elementIndex;
  const currentPageElements = pages.find(p => p.name === current).elements;
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