import React from 'react';
import {Expression} from "../stores/ExpressionStore";


interface Props {
    exr: Expression;
}

const ExpressionPanel: React.FC<Props> = (expression) => {
    return (
        <div className="Panel">
            :{expression.exr.formula}
        </div>
    );
};

export default ExpressionPanel;
