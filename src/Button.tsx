import React from 'react';

const Button: React.FC<{ capture: string; char?: string; }> = (props) => {
    return (
        <div>
         [{props.capture}]
        </div>
    );
}

export default Button;
