import React from 'react';
import renderer from 'react-test-renderer';
import {
  PosButton,
  NegButton,
  NeutralButton
} from 'components/common/Buttons';

describe('buttons', () => {
  describe('PosButton', () => {
    it('creates a <button> element', () => {
      const Button = renderer.create(
        <PosButton>Positive</PosButton>
      );
      const tree = Button.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
  
  describe('NegButton', () => {
    it('creates a <button> element', () => {
      const Button = renderer.create(
        <NegButton>Positive</NegButton>
      );
      const tree = Button.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('NeutralButton', () => {
    it('creates a <button> element', () => {
      const Button = renderer.create(
        <NeutralButton>Positive</NeutralButton>
      );
      const tree = Button.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('sets the title attribute', () => {
      const title = 'foo';
      const Button = renderer.create(
        <NeutralButton title={title}>Positive</NeutralButton>
      );
      const tree = Button.toJSON();
      expect(tree.props.title).toBe(title)
      expect(tree).toMatchSnapshot();
    });

    it('sets the disabled attribute', () => {
      const Button = renderer.create(
        <NeutralButton disabled>Positive</NeutralButton>
      );
      const tree = Button.toJSON();
      expect(tree.props.disabled).toBe(true);
      expect(tree).toMatchSnapshot();
    });

    it('sets the button type', () => {
      const type = 'submit';
      const Button = renderer.create(
        <NeutralButton type={type}>Positive</NeutralButton>
      );
      const tree = Button.toJSON();
      expect(tree.props.type).toBe(type);
      expect(tree).toMatchSnapshot();
    });

    it('sets the onClick event using the click prop', () => {
      const Button = renderer.create(
        <NeutralButton click={() => 1}>Positive</NeutralButton>
      );
      const tree = Button.toJSON();
      expect(tree).toMatchSnapshot();
      expect(tree.props.onClick()).toBe(1);
    });
  });
});
