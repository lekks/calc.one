import React from 'react';

import {expressionStore} from "../stores/ExpressionStore";
import ExpressionPanel from "./ExpressionPanel";
import {StackItem} from "../calculator/Calculator";
import {Subscription} from "rxjs";

interface State {
    expressions: StackItem[];
}

class ExpressionStack extends React.Component<any, State> {
    private subscription?: Subscription;

    constructor(props: {}) {
        super(props,);
        this.state = {expressions: []};
        this.subscription = expressionStore.expressionStack.subscribe((expressions) => {
            this.setState({expressions})
        })
    }


    public componentWillUnmount() {
        this.subscription && this.subscription.unsubscribe();
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
}

export default ExpressionStack;
