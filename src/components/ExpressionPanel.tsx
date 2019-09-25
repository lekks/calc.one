import React from 'react';
import {Expression} from "../stores/Expression";

import 'katex/dist/katex.min.css';
import {BlockMath} from 'react-katex';


interface Props {
    expression: Expression;
}

const ExpressionPanel: React.FC<Props> = (expression) => {
    const resStr: string = isNaN(expression.expression.getResult()) ? "?" : String(expression.expression.getResult());
    const texStr: string = `${expression.expression.getTex()}=${resStr}`;
    return (
        <div className="Panel">
            <BlockMath math={texStr}/>
        </div>

    );
};

export default ExpressionPanel;
