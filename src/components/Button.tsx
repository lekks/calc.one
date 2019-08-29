import React from 'react';
import {buttonClick} from '../actions/ButtonActions';
import Actions from "../actions/Actions";

interface Props {
    capture: string;
    tag: string;
    action: Actions;
}

class Button extends React.Component<Props, any> {
    render() {
        return (
            <button onClick={this._onClick}>
                [{this.props.capture}]
            </button>
        );
    }

    _onClick = () => {
        buttonClick(this.props.action, this.props.tag)
    }
}

export default Button;
