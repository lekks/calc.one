import React from 'react';
import {Expression} from "../stores/Expression";

import 'katex/dist/katex.min.css';
import {BlockMath} from 'react-katex';

const ROUND = 6;

interface Props {
    expression: Expression;
}

const ExpressionPanel: React.FC<Props> = (expression) => {
    const result = Number(expression.expression.getResult().toFixed(ROUND));
    const resStr: string = isNaN(result) ? "?" : String(result);
    const texStr: string = `${expression.expression.getTex()}=${resStr}`;
    return (
        <div className="Expression">
            <BlockMath math={texStr}/>
        </div>

    );
};

export default ExpressionPanel;
