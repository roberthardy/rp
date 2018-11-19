import { should, expect } from "chai";
import "mocha";

import { onRequestReceived } from "../trafficTrace";
import { IncomingMessage } from "http";

should();

describe("onRequestReceived()", () => {
  describe("GET request", () => {
    describe("text", () => {
      it("should be correctly mapped", () => {
        const incomingMessage = new IncomingMessage(null);
        incomingMessage.url = "/testurl";
        incomingMessage.method = "GET";
        incomingMessage.headers["content-type"] = "text/html";

        let result = onRequestReceived(incomingMessage, new Buffer("test content"));
        result.path.should.equal("/testurl");
        result.method.should.equal("GET");
        result.body.should.equal("test content");
        result.headers["content-type"].should.equal("text/html");
      });
    });
  });
});
