import React from 'react';


interface Props {
    text: string;
}

const ExpressionPanel: React.FC<Props> = (expression) => {
    return (
        <div className="Panel">
            :{expression.text}
        </div>
    );
};

export default ExpressionPanel;
