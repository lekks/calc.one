import React from 'react';
import {Expression} from "../stores/Expression";

import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';


interface Props {
    expression: Expression;
}

const ExpressionPanel: React.FC<Props> = (expression) => {

    return (
        <div className="Panel">
            :{expression.expression.getFormula()}={expression.expression.getResult()}
            <BlockMath math="\dots"/>
        </div>
    );
};

export default ExpressionPanel;
