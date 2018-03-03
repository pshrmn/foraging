import * as actions from "actions/general";
import * as ActionTypes from "constants/ActionTypes";

describe("general actions", () => {

  describe("closeForager", () => {
    it("returns an action to close (hide) the forager extension", () => {
      const action = actions.closeForager();
      expect(action.type).toBe(ActionTypes.CLOSE_FORAGER);
    });
  });

  describe("openForager", () => {
    it("returns an action to open (show) the forager extension", () => {
      const action = actions.openForager();
      expect(action.type).toBe(ActionTypes.OPEN_FORAGER);
    });
  });
});
