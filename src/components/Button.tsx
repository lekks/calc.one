import React from 'react';
import {buttonClick} from '../actions/ButtonActions';

interface Props {
    capture: string;
    char?: string;
}

class Button extends React.Component<Props, any> {
    render() {
        return (
            <button onClick={ this._onClick }>
                    [{this.props.capture}]
            </button>
    );
    }
    _onClick = () => {
        buttonClick(this.props.capture)
    }
}

export default Button;
