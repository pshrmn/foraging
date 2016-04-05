import {expect} from "chai";
import * as actions from "../../../src/actions/general";
import * as ActionTypes from "../../../src/constants/ActionTypes";

describe("general actions", () => {

  describe("closeForager", () => {
    it("returns an action to close (hide) the forager extension", () => {
      const action = actions.closeForager();
      expect(action.type).to.equal(ActionTypes.CLOSE_FORAGER);
    });
  });

  describe("openForager", () => {
    it("returns an action to open (show) the forager extension", () => {
      const action = actions.openForager();
      expect(action.type).to.equal(ActionTypes.OPEN_FORAGER);
    });
  });

  describe("showMessage", () => {
    it("returns an action with the expected values", () => {
      const msg = "this is the message";
      const fade = 1000;
      const action = actions.showMessage(msg, fade);
      expect(action.type).to.equal(ActionTypes.SHOW_MESSAGE);
      expect(action.text).to.equal(msg);
      expect(action.wait).to.equal(fade);
    });
  });
});
