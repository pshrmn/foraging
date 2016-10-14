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
};

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
  });

  function checkEvent(fn) {
    return function(event) {
      if ( event.target.classList.contains(className) ) {
        event.stopPropagation();
        fn(event);
      }
    };
  }

  const checkOver = checkEvent(over);
  const checkOut = checkEvent(out);
  const checkClick = checkEvent(click);

  document.body.addEventListener('mouseover', checkOver, false);
  document.body.addEventListener('mouseout', checkOut, false);
  document.body.addEventListener('click', checkClick, false);

  return function iUnhighlight() {

    Array.from(elements).forEach(e => {
      e.classList.remove(className);
    });

    document.body.removeEventListener('mouseover', checkOver, false);
    document.body.removeEventListener('mouseout', checkOut, false);
    document.body.removeEventListener('click', checkClick, false);
  };
};
