import React from 'react';
import ExpressionPanel from "./ExpressionPanel";
import {StackItem} from "../calculator/Calculator";
import {Subject, Subscription} from "rxjs";

interface State {
    expressions: StackItem[];
}

interface Props {
    subject: Subject<StackItem[]>;
}

class ExpressionStack extends React.Component<any, State> {
    private subscription?: Subscription;

    constructor(props: Props) {
        super(props,);
        this.state = {expressions: []};
        this.subscription = props.subject.subscribe((expressions) => {
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
