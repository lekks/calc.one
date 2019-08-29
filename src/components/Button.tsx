import React from 'react';
import {buttonClick} from '../actions/ButtonActions';
import Actions from "../actions/Actions";

interface Props {
    capture: string;
    action?: Actions;
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
