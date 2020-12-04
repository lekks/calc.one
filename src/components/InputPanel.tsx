import React from 'react';

import {expressionStore} from "../stores/ExpressionStore";
import {Subscription} from "rxjs";

interface State {
    text: string;
}

class InputPanel extends React.Component<any, State> {
    subscription?: Subscription;

    constructor(props: {}) {
        super(props,);
        this.state = {text: ""};
        this.subscription = expressionStore.editorText.subscribe((text) => {
            this.setState({text})
        })

    }

    public componentWillUnmount() {
        this.subscription && this.subscription.unsubscribe();
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
