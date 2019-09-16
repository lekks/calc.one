import React from 'react';
import {Expression} from "../stores/Expression";


interface Props {
    expression: Expression;
}

const ExpressionPanel: React.FC<Props> = (expression) => {
    return (
        <div className="Panel">
            :{expression.expression.getFormula()}={expression.expression.getResult()}
        </div>
    );
};

export default ExpressionPanel;
