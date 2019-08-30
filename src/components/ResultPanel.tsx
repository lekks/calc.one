import React from 'react';
import FBEmitter from "fbemitter";

import {expressionStore, ResultType} from "../stores/ExpressionStore";

interface State {
    result: ResultType;
}

class ResultPanelPanel extends React.Component<any, State> {
    private eventSubscription: FBEmitter.EventSubscription;

    constructor(props: {}) {
        super(props,);
        this.state = ResultPanelPanel.getStateFromStores();
        this.eventSubscription = expressionStore.addChangeListener(this.onChange);
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
        this.setState(ResultPanelPanel.getStateFromStores());
    };
}

export default ResultPanelPanel;
