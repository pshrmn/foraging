import React from 'react';
import renderer from 'react-test-renderer';
import Cycle from 'components/common/Cycle';

describe('Cycle', () => {
  it('create a Cycle component', () => {
    const component = renderer.create(
      <Cycle index={0} count={10}/>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls setIndex when left button is clicked', () => {
    const spy = jest.fn();
    const component = renderer.create(
      <Cycle index={5} count={10} setIndex={spy} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // clicking the left button should call the function, passing
    // it index - 1
    tree.children[0].props.onClick()
    expect(spy.mock.calls.length).toBe(1)
    expect(spy.mock.calls[0]).toEqual([4])
  });

  it('calls setIndex when right button is clicked', () => {
    const spy = jest.fn();
    const component = renderer.create(
      <Cycle index={5} count={10} setIndex={spy} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // clicking the left button should call the function, passing
    // it index + 1
    tree.children[4].props.onClick()
    expect(spy.mock.calls.length).toBe(1)
    expect(spy.mock.calls[0]).toEqual([6])
  });
});
