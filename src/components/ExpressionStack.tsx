import React from 'react';
import FBEmitter from "fbemitter";

import {ExpressionEvents, expressionStore, ExpressionType} from "../stores/ExpressionStore";
import ExpressionPanel from "./ExpressionPanel";

interface State {
    expression: ExpressionType;
}

class ExpressionStack extends React.Component<any, State> {
    private eventSubscription: FBEmitter.EventSubscription;

    constructor(props: {}) {
        super(props,);
        this.state = ExpressionStack.getStateFromStores();
        this.eventSubscription = expressionStore.addChangeListener(ExpressionEvents.CHANGE_EVENT, this.onChange);
    }

    private static getStateFromStores(): State {
        return {expression: expressionStore.getExpression()};
    }

    public componentWillUnmount() {
        this.eventSubscription.remove();
    }

    render() {
        return (
            <div className="Stack">
                {[this.state.expression].map(text => <ExpressionPanel text={text}/>)}
            </div>
        );
    }

    private onChange = () => {
        this.setState(ExpressionStack.getStateFromStores());
    };
}

export default ExpressionStack;
