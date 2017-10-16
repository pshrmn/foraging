import Home from 'route-components/Home';

import AddPage from 'route-components/AddPage';
import AddPageControls from 'route-controls/AddPageControls';

import Page from 'route-components/Page';
import PageControls from 'route-controls/PageControls';

import Preview from 'route-components/Preview';
import PreviewControls from 'route-controls/PreviewControls';

import AddSelector from 'route-components/AddSelector';

import EditSelector from 'route-components/EditSelector';

import AddRule from 'route-components/AddRule';

import EditRule from 'route-components/EditRule';

import store from 'store';
import { fullGrow } from 'helpers/page';
import { preview } from 'helpers/preview';

const NoControls = () => null;

export default [
  {
    name: 'Home',
    path: '',
    body: () => ({
      main: Home,
      controls: NoControls
    })
  },
  {
    name: 'Add Page',
    path: 'add-page',
    body: () => ({
      main: AddPage,
      controls: AddPageControls
    })
  },
  {
    name: 'Page',
    path: 'page/:name',
    body: () => ({
      main: Page,
      controls: PageControls
    }),
    children: [
      {
        name: 'Preview',
        path: 'preview',
        body: () => ({
          main: Preview,
          controls: PreviewControls
        }),
        load: (params, location, mods) => {
          // generate the preview tree
          const { pages } = store.getState();
          const page = pages.find(p => p.name === params.name);
          const tree = preview(fullGrow(page.elements));
          mods.setData({ tree, name: page.name });
        }
      },
      {
        name: 'Add Selector',
        path: 'add/:index',
        body: () => ({
          main: AddSelector,
          controls: NoControls
        }),
        params: {
          index: n => parseInt(n, 10)
        }
      },
      {
        name: 'Edit Selector',
        path: 'edit/:index',
        body: () => ({
          main: EditSelector,
          controls: NoControls
        }),
        params: {
          index: n => parseInt(n, 10)
        }
      },
      {
        name: 'Add Rule',
        path: 'add-rule/:index',
        body: () => ({
          main: AddRule,
          controls: NoControls
        }),
        params: {
          index: n => parseInt(n, 10)
        }
      },
      {
        name: 'Edit Rule',
        path: 'Edit-rule/:index/:ruleIndex',
        body: () => ({
          main: EditRule,
          controls: NoControls
        }),
        params: {
          index: n => parseInt(n, 10),
          ruleIndex: n => parseInt(n, 10)
        }
      }
    ]
  }
];
