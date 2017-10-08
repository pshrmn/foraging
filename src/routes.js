import store from 'store';
import Home from 'route-components/Home';
import Page from 'route-components/Page';

import { selectPage } from 'actions';

export default [
  {
    name: 'Home',
    path: '',
    body: () => Home
  },
  {
    name: 'Page',
    path: 'page/:name',
    body: () => Page,
    load: (params) => {
      const { name } = params;
      store.dispatch(selectPage(name));
    }
  }
];
