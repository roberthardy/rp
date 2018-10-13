import * as React from "react";
import { RequestData, ResponseData, HttpExchange } from "../../common/models";

interface Props {
  exchange: HttpExchange;
}

export class HttpExchangeBox extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return <li>{this.props.exchange.request.path}</li>;
  }
}
