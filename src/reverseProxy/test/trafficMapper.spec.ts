import { should, expect } from "chai";
import "mocha";

import { onRequestReceived } from "../trafficTrace";
import { IncomingMessage } from "http";

should();

describe("onRequestReceived()", () => {
  describe("GET request", () => {
    describe("null body", () => {
      it("should be correctly mapped", () => {
        const incomingMessage = new IncomingMessage(null);
        incomingMessage.url = "/testurl";
        incomingMessage.method = "GET";

        let result = onRequestReceived(incomingMessage);
        result.path.should.equal("/testurl");
      });
    });
  });
});
