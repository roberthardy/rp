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
    return <tr><td>{this.props.exchange.request.path}</td></tr>;
  }
}
