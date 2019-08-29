import React from 'react';
import FBEmitter from "fbemitter";

import {ExpressionType, expressionStore} from "../stores/ExpressionStore";

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

    private onChange = () => {
        this.setState(ExpressionPanel.getStateFromStores());
    };

    public componentWillUnmount() {
        this.eventSubscription.remove();
    }

    render() {
        return (
            <div>
                :{this.state.expression}
            </div>
        );
    }

    private static getStateFromStores():State {
        return {expression: expressionStore.getExpression()};
    }
}

export default ExpressionPanel;
