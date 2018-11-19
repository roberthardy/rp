import { should } from "chai";
import "mocha";

import { onRequestReceived, onResponseReceived } from "../trafficTrace";
import { IncomingMessage, ServerResponse } from "http";

should();

describe("onRequestReceived()", () => {
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

describe("onResponseReceived()", () => {
  describe("text", () => {
    it("should be correctly mapped", () => {
      const serverResponse = new ServerResponse(new IncomingMessage(null));
      serverResponse.statusCode = 200;
      serverResponse.setHeader("test-header", "test header value");

      let result = onResponseReceived(serverResponse, new Buffer("test content"));
      result.body.should.equal("test content");
      result.statusCode.should.equal(200);
      result.headers["test-header"].should.equal("test header value");
    });
  });
});
