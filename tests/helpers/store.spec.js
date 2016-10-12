import { currentElement, currentParent, takenNames } from 'helpers/store';

describe('store', () => {

  const pageStore = {
    pages: [
      null,
      {
        name: 'projects',
        elements: [
          {
            optional: false,
            rules: [],
            selector: 'body',
            spec: {
              index: 0,
              type: 'single'
            },
            parent: null,
            childIndices: [1],
            index: 0
          },
          {
            optional: false,
            rules: [],
            selector: '.project',
            spec: {
              name: 'projects',
              type: 'all'
            },
            parent: 0,
            childIndices: [2, 3, 4],
            index: 1
          },
          {
            optional: false,
            rules: [],
            selector: 'h3',
            spec: {
              index: 0,
              type: 'single'
            },
            parent: 1,
            childIndices: [5],
            index: 2
          },
          {
            optional: true,
            rules: [
              {
                attr: 'src',
                name: 'thumbnail',
                type: 'string'
              }
            ],
            selector: 'img',
            spec: {
              index: 0,
              type: 'single'
            },
            parent: 1,
            childIndices: [],
            index: 3
          },
          {
            optional: false,
            rules: [
              {
                attr: 'text',
                name: 'description',
                type: 'string'
              }
            ],
            selector: 'p',
            spec: {
              index: 0,
              type: 'single'
            },
            parent: 1,
            childIndices: [],
            index: 4
          },
          {
            optional: false,
            rules: [
              {
                attr: 'text',
                name: 'title',
                type: 'string'
              },
              {
                attr: 'href',
                name: 'url',
                type: 'string'
              }
            ],
            selector: 'a',
            spec: {
              index: 0,
              type: 'single'
            },
            parent: 2,
            childIndices: [],
            index: 5
          }
        ]
      }
    ],
    pageIndex: 1,
    elementIndex: 0
  }

  let pageCopy;
  beforeEach(() => {
    pageCopy = Object.assign({}, pageStore)
  })

  describe('currentElement', () => {
    it('returns the currently selected element', () => {
      const index = 1;
      pageCopy.elementIndex = index;
      const current = currentElement(pageCopy);
      expect(current.index).toBe(index);
    })
  });

  describe('currentParent', () => {
    it('returns the parent element of the currently selected element', () => {
      const pairs = [
        {index: 1, parent: 0},
        {index:5, parent: 2},
        {index: 0, parent: null}
      ];
      pairs.forEach(p => {
        const {index, parent} = p;
        pageCopy.elementIndex = index;
        const element = currentParent(pageCopy);
        if ( parent !== null ) {
          expect(element.index).toBe(parent);
        } else {
          expect(element).toBeUndefined();
        }
      })
    })
  });

  describe('takenNames', () => {
    it('returns an array of names used in the parent level of the current element', () => {
      const pairs = [
        {index: 1, names: ['projects']},
        {index: 4, names: ['title', 'url', 'thumbnail', 'description']}
      ];
      pairs.forEach(p => {
        const {index, names} = p;
        pageCopy.elementIndex = index;
        const levelNames = takenNames(pageCopy);
        const sameNames = levelNames.every((n,i) => n === names[i])
        expect(sameNames).toBe(true);
      })
    });
  });

});
