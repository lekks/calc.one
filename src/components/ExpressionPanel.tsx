import React from 'react';
import {Expression} from "../stores/Expression";

import 'katex/dist/katex.min.css';
import {BlockMath} from 'react-katex';


interface Props {
    expression: Expression;
}

const ExpressionPanel: React.FC<Props> = (expression) => {
    const texStr: string = `${expression.expression.getTex()}=${expression.expression.getResult()}`;
    return (
        <div className="Panel">
            <BlockMath math={texStr}/>
        </div>

    );
};

export default ExpressionPanel;
