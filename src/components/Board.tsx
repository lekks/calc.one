import React from 'react';
import FBEmitter from "fbemitter";

import {Expression, expressionStore} from "../stores/ExpressionStore";

interface State {
    expression: Expression;
}

class Board extends React.Component<any, State> {
    private eventSubscription: FBEmitter.EventSubscription;
    constructor(props: {}) {
        super(props,);
        this.state = Board.getStateFromStores();
        this.eventSubscription = expressionStore.addChangeListener(this.onChange);

    }
    private onChange = () => {
        this.setState(Board.getStateFromStores());
    };

    public componentWillUnmount() {
        this.eventSubscription!.remove();
    }

    render() {
        return (
            <div>
                ${this.state.expression}
            </div>
        );
    }
    private static getStateFromStores():State {
        return {expression: expressionStore.getState()};
    }
}

export default Board;
