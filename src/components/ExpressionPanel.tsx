import React from 'react';

import 'katex/dist/katex.min.css';
import {BlockMath} from 'react-katex';
import {StackItem} from "../calculator/Calculator";

const ROUND = 6;

interface Props {
    expression: StackItem;
}

const ExpressionPanel: React.FC<Props> = (expression) => {
    const result = Number(expression.expression.result.toFixed(ROUND));
    const resStr: string = isNaN(result) ? "?" : String(result);
    //Choosing fonts (overrides ,katex): https://katex.org/docs/supported.html#style-color-size-and-font
    const texStr: string = `${expression.expression.texFormula}=${resStr}`;
    return (
        <div className="Expression">
            <BlockMath math={texStr}/>
        </div>

    );
};

export default ExpressionPanel;
