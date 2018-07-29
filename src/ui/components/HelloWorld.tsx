import * as React from 'react';

interface IProps {
    what: string
}

export class HelloWorld extends React.Component<IProps, {}> {
    render() {
        return <h1>Hello {this.props.what}!</h1>
    }
}