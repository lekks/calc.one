import React from 'react';
import FBEmitter from "fbemitter";

import {expressionStore, ExpressionType} from "../stores/ExpressionStore";

interface State {
    expression: ExpressionType;
}

class ExpressionPanel extends React.Component<any, State> {
    private eventSubscription: FBEmitter.EventSubscription;

    constructor(props: {}) {
        super(props,);
        this.state = ExpressionPanel.getStateFromStores();
        this.eventSubscription = expressionStore.addChangeListener(this.onChange);
    }

    private static getStateFromStores(): State {
        return {expression: expressionStore.getExpression()};
    }

    public componentWillUnmount() {
        this.eventSubscription.remove();
    }

    render() {
        return (
            <div className="Panel">
                :{this.state.expression}
            </div>
        );
    }

    private onChange = () => {
        this.setState(ExpressionPanel.getStateFromStores());
    };
}

export default ExpressionPanel;
