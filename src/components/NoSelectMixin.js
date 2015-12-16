
/*
 * When choosing elements in the page, the selector uses a :not(.no-select)
 * query to ignore certain elements. To make sure that no elements in the
 * Forager app are selected, this function selects all child elements in the
 * app and gives them the "no-select" class. This is done in lieu of manually
 * setting className="no-select" on all elements (and handling cases where
 * there are multiple classes on an element). Ideally a :not(.forager, .forager *)
 * selector would exist, but this will have to do.
 *
 * While most state updates are done through the store and thus managing the
 * "no-select" class can mostly be done through the main app, a few Frames
 * maintain an internal state and so they need to set the "no-select" class
 * on their children themselves.
 *
 * The main element in a component with the NoSelectMixin applied needs to have
 * a ref="parent" prop.
 */
export default {
  _makeNoSelect: function() {
    this.refs.parent.classList.add("no-select");
    [].slice.call(this.refs.parent.querySelectorAll("*")).forEach(c => {
      c.classList.add("no-select");
    });
  },
  componentDidMount: function() {
    // load the site's pages from chrome.storage.local and set the state
    this._makeNoSelect();
  },
  componentDidUpdate: function() {
    this._makeNoSelect();
  }
}
