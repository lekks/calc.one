import React from 'react';
import {Expression} from "../expression/Expression";

import 'katex/dist/katex.min.css';
import {BlockMath} from 'react-katex';

const ROUND = 6;

interface Props {
    expression: Expression;
}

const ExpressionPanel: React.FC<Props> = (expression) => {
    const result = Number(expression.expression.getResult().toFixed(ROUND));
    const resStr: string = isNaN(result) ? "?" : String(result);
    //Choosing fonts (overrides ,katex): https://katex.org/docs/supported.html#style-color-size-and-font
    const texStr: string = `${expression.expression.getTex()}=${resStr}`;
    return (
        <div className="Expression">
            <BlockMath math={texStr}/>
        </div>

    );
};

export default ExpressionPanel;
