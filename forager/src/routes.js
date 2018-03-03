import HomeControls from 'route-controls/HomeControls';

import AddPageControls from 'route-controls/AddPageControls';

import Page from 'route-components/Page';
import PageControls from 'route-controls/PageControls';

import Preview from 'route-components/Preview';
import PreviewControls from 'route-controls/PreviewControls';

import AddElement from 'route-components/AddElement';
import AddElementControls from 'route-controls/AddElementControls';

import EditElement from 'route-components/EditElement';
import EditElementControls from 'route-controls/EditElementControls';

import AddRule from 'route-components/AddRule';
import AddRuleControls from 'route-controls/AddRuleControls';

import EditRule from 'route-components/EditRule';
import EditRuleControls from 'route-controls/EditRuleControls';

import store from 'store';
import { fullGrow } from 'helpers/page';
import { preview } from 'helpers/preview';

const NullComponent = () => null;

export default [
  {
    name: 'Home',
    path: '',
    body: () => ({
      main: NullComponent,
      controls: HomeControls
    })
  },
  {
    name: 'Add Page',
    path: 'add-page',
    body: () => ({
      main: NullComponent,
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
        name: 'Element',
        path: 'element/:index',
        params: {
          index: n => parseInt(n, 10)
        },
        children: [
          {
            name: 'Add Element',
            path: 'add',
            body: () => ({
              main: AddElement,
              controls: AddElementControls
            })
          },
          {
            name: 'Edit Element',
            path: 'edit',
            body: () => ({
              main: EditElement,
              controls: EditElementControls
            })
          },
          {
            name: 'Add Rule',
            path: 'add-rule',
            body: () => ({
              main: AddRule,
              controls: AddRuleControls
            })
          },
          {
            name: 'Edit Rule',
            path: 'edit-rule/:ruleIndex',
            body: () => ({
              main: EditRule,
              controls: EditRuleControls
            }),
            params: {
              ruleIndex: n => parseInt(n, 10)
            }
          }
        ]
      }
    ]
  }
];
