import React from 'react';
import {buttonClick} from '../actions/ButtonActions';
import Actions from "../actions/Actions";

interface Props {
    capture: string;
    tag: string;
    action: Actions;
    keybind?: string;
}

class Button extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props,);
        document.addEventListener("keydown", this.onKeyDown)
    }

    public componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown);
    }

    public render() {
        return (
            <button onClick={this.onClick} className={"Button"}>
                [{this.props.capture}]
            </button>
        );
    }

    private onClick = () => {
        buttonClick(this.props.action, this.props.tag)
    };

    private onKeyDown = (e: KeyboardEvent) => {
        if (e.key === this.props.keybind) {
            this.onClick()
        }
    }
}

export default Button;
