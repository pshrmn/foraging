import store from 'store';
import Home from 'route-components/Home';
import AddPage from 'route-components/AddPage';
import Page from 'route-components/Page';
import Preview from 'route-components/Preview';
import AddSelector from 'route-components/AddSelector';

import { selectPage } from 'actions';

export default [
  {
    name: 'Home',
    path: '',
    body: () => Home
  },
  {
    name: 'Add Page',
    path: 'add-page',
    body: () => AddPage
  },
  {
    name: 'Page',
    path: 'page/:name',
    body: () => Page,
    load: (params) => {
      const { name } = params;
      store.dispatch(selectPage(name));
    },
    children: [
      {
        name: 'Preview',
        path: 'preview',
        body: () => Preview
      },
      {
        name: 'Add Selector',
        path: 'add/:index',
        body: () => AddSelector
      }
    ]
  }
];
