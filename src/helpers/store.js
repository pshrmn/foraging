import { levelNames } from 'helpers/page';

/*
 * returns the currently selected element
 */
export function currentElement(page) {
  const { pages, pageIndex, elementIndex } = page;
  const currentPage = pages[pageIndex];
  return currentPage === undefined ? undefined : currentPage.elements[elementIndex];
}

/*
 * returns the parent element of the currently selected element
 * or undefined if either the current element does not exist
 */
export function currentParent(page) {
  const { pages, pageIndex, elementIndex } = page;
  const currentPage = pages[pageIndex];
  const current = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
  return current === undefined ? undefined : currentPage.elements[current.parent];
}

/*
 * return a list of names for all elements in the same level as
 * the current element
 */
export function takenNames(page) {
  const current = currentElement(page);
  const index = current.parent !== null ? current.parent : page.elementIndex;
  const currentPage = page.pages[page.pageIndex].elements;
  return levelNames(currentPage, index);
}