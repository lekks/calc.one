import React from 'react';
import FBEmitter from "fbemitter";

import {ExpressionEvents, expressionStore} from "../stores/ExpressionStore";
import ExpressionPanel from "./ExpressionPanel";
import {StackItem} from "../calculator/Calculator";

interface State {
    expressions: StackItem[];
}

class ExpressionStack extends React.Component<any, State> {
    private eventSubscription: FBEmitter.EventSubscription;

    constructor(props: {}) {
        super(props,);
        this.state = ExpressionStack.getStateFromStores();
        this.eventSubscription = expressionStore.addChangeListener(ExpressionEvents.STACK_CHANGE_EVENT, this.onChange);
    }

    private static getStateFromStores(): State {
        return {expressions: expressionStore.getStack()};
    }

    public componentWillUnmount() {
        this.eventSubscription.remove();
    }

    render() {
        const reversed = this.state.expressions.slice().reverse();
        return (
            <div className="Stack">
                {reversed.map((expr: StackItem, index) =>
                    <React.Fragment key={index}>
                        {index ? <hr/> : null}
                        <ExpressionPanel expression={expr}/>
                    </React.Fragment>
                )}
            </div>
        );
    }

    private onChange = () => {
        this.setState(ExpressionStack.getStateFromStores());
    };
}

export default ExpressionStack;
