import Home from 'route-components/Home';
import AddPage from 'route-components/AddPage';
import Page from 'route-components/Page';
import Preview from 'route-components/Preview';
import AddSelector from 'route-components/AddSelector';
import EditSelector from 'route-components/EditSelector';
import AddRule from 'route-components/AddRule';
import EditRule from 'route-components/EditRule';

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
      },
      {
        name: 'Edit Selector',
        path: 'edit/:index',
        body: () => EditSelector
      },
      {
        name: 'Add Rule',
        path: 'add-rule/:index',
        body: () => AddRule
      },
      {
        name: 'Edit Rule',
        path: 'Edit-rule/:index/:ruleIndex',
        body: () => EditRule
      }
    ]
  }
];
