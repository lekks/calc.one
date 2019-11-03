import React from 'react';
import FBEmitter from "fbemitter";

import {ExpressionEvents, expressionStore} from "../stores/ExpressionStore";

interface State {
    text: string;
}

class InputPanel extends React.Component<any, State> {
    private eventSubscription: FBEmitter.EventSubscription;

    constructor(props: {}) {
        super(props,);
        this.state = InputPanel.getStateFromStores();
        this.eventSubscription = expressionStore.addChangeListener(ExpressionEvents.INPUT_CHANGE_EVENT, this.onChange);
    }

    private static getStateFromStores(): State {
        return {
            text: expressionStore.getInput()
        };
    }

    public componentWillUnmount() {
        this.eventSubscription.remove();
    }

    render() {
        return (
            <div className="Input">
                {this.state.text}
            </div>
        );
    }

    private onChange = () => {
        this.setState(InputPanel.getStateFromStores());
    };
}

export default InputPanel;
