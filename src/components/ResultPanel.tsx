import React from 'react';
import FBEmitter from "fbemitter";

import {ResultType, expressionStore} from "../stores/ExpressionStore";

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

    private onChange = () => {
        this.setState(ResultPanelPanel.getStateFromStores());
    };

    public componentWillUnmount() {
        this.eventSubscription.remove();
    }

    render() {
        return (
            <div>
                ={this.state.result}
            </div>
        );
    }

    private static getStateFromStores():State {
        return {result: expressionStore.getResult()};
    }
}

export default ResultPanelPanel;
