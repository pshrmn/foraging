import {expect} from "chai";

import messages from "../../../src/reducers/messages";
import * as ActionTypes from "../../../src/constants/ActionTypes";

describe("messages reducer", () => {
  describe("unknown", () => {
    it("returns default for unknown action types", () => {
      const state = [];
      const action = {
        type: "UNKNOWN_ACTION_TYPE"
      };
      const newState = messages(state, action);
      expect(newState).to.deep.equal(state);
    });
  });

  // SHOW_MESSAGE shouldn't reach the reducer (caught by middleware)

  describe("ADD_MESSAGE", () => {
    it("adds the message to the message array", () => {
      const state = [];
      const msg = "test message";
      const id = 7;
      const newState = messages(state, {
        type: ActionTypes.ADD_MESSAGE,
        text: msg,
        id: id
      });
      expect(newState.length).to.equal(1);
      const first = newState[0];
      expect(first.id).to.equal(id);
      expect(first.text).to.equal(msg);
    });
  });

  describe("REMOVE_MESSAGE", () => {
    it("returns messages array with matched message removed", () => {
      const state = [
        {id: 'abcde', text: 'alphabet'},
        {id: '12345', text: 'count von count'}
      ];
      expect(state.length).to.equal(2)
      const newState = messages(state, {
        type: ActionTypes.REMOVE_MESSAGE,
        id: 'abcde'
      });
      expect(newState.length).to.equal(1)
    });

    it("does nothing when no messages match the id", () => {
      const state = [
        {id: 'abcde', text: 'alphabet'},
        {id: '12345', text: 'count von count'}
      ];
      expect(state.length).to.equal(2)
      const newState = messages(state, {
        type: ActionTypes.REMOVE_MESSAGE,
        id: 'zyxwv'
      });
      expect(newState.length).to.equal(2)
    });
  })
});
