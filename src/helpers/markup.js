/*
 * highlight
 * ---------
 *
 * @param elements - an array of elements
 * @param className - the class added to the elements
 */
export const highlight = (elements, className) => {
  Array.from(elements).forEach(e => {
    e.classList.add(className);
  });
};

/*
 * unhighlight
 * -----------
 *
 * @param className - the className to remove from all elements that have it
 */
export const unhighlight = className => {
  Array.from(document.getElementsByClassName(className)).forEach(e => {
    e.classList.remove(className);
  });
}

/*
 * iHighlight
 * ---------
 *
 * @param elements - an array of elements
 * @param className - the class added to the elements
 * @param over - the function to call on mouseover
 * @param out - the function to call on mouseout
 * @param click - the function to call when an element is clicked
 */
export const iHighlight = (elements, className, over, out, click) => {
  Array.from(elements).forEach(e => {
    e.classList.add(className);
    e.addEventListener('mouseover', over, false);
    e.addEventListener('mouseout', out, false);
    e.addEventListener('click', click, false);
  });
};

/*
 * iUnhighlight
 * ---------
 *
 * @param className - the className to remove from all elements that have it
 * @param over - mouseover function to remove
 * @param out - mouseout function to remove
 * @param click - click function to remove
 */
export const iUnhighlight = (className, over, out, click) => {
  Array.from(document.getElementsByClassName(className)).forEach(e => {
    e.classList.remove(className);
    e.removeEventListener('mouseover', over, false);
    e.removeEventListener('mouseout', out, false);
    e.removeEventListener('click', click, false);
  });   
};
