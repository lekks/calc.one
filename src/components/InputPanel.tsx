import React from 'react';

import {Subject, Subscription} from "rxjs";

interface State {
    text: string;
}

interface Props {
    subject: Subject<string>;
}

class InputPanel extends React.Component<any, State> {
    subscription: Subscription;

    constructor(props: Props) {
        super(props,);
        this.state = {text: ""};
        this.subscription = props.subject.subscribe((text) => {
            this.setState({text})
        })

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
