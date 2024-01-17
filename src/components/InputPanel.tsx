import React from 'react';

import {Observable, Subscription} from "rxjs";

interface State {
    text: string;
}

interface Props {
    text: Observable<string>;
}

class InputPanel extends React.Component<any, State> {
    private readonly subscription = new Subscription();

    constructor(props: Props) {
        super(props,);
        this.state = {text: ""};
        this.subscription.add(props.text.subscribe((text) => {
            this.setState({text})
        }))

    }

    public componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    render() {
        return (
            <div className="Input">
                {this.state.text}
            </div>
        );
    }

}

export default InputPanel;
