import React from 'react';
import FBEmitter from "fbemitter";

import {ExpressionEvents, expressionStore, ResultType} from "../stores/ExpressionStore";

interface State {
    result: ResultType;
}

class ResultPanel extends React.Component<any, State> {
    private eventSubscription: FBEmitter.EventSubscription;

    constructor(props: {}) {
        super(props,);
        this.state = ResultPanel.getStateFromStores();
        this.eventSubscription = expressionStore.addChangeListener(ExpressionEvents.CHANGE_EVENT, this.onChange);
    }

    private static getStateFromStores(): State {
        return {result: expressionStore.getResult()};
    }

    public componentWillUnmount() {
        this.eventSubscription.remove();
    }

    render() {
        return (
            <div className="Panel">
                ={this.state.result}
            </div>
        );
    }

    private onChange = () => {
        this.setState(ResultPanel.getStateFromStores());
    };
}

export default ResultPanel;
