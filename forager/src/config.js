import createConfig from '@curi/core';

import history from 'history';
import routes from 'routes';

function ResizeMargin() {
  const forager = document.getElementById('forager');
  let height;
  if (!forager) {
    // this will be called before we have actually mounted, so set an
    // initial value
    height = 50;
  } else {
    height = forager.offsetHeight;
  }
  document.body.style.marginTop = height + 'px';
}

export default createConfig(history, routes, {
  sideEffects: [
    { after: true, fn: ResizeMargin }
  ]
});
