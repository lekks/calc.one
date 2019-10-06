import React from 'react';
import {buttonClick} from '../actions/ButtonActions';
import Actions from "../dispatcher/Actions";

interface Props {
    caption: string;
    tag?: string;
    action: Actions;
    keybind?: string;
}

class CalcButton extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props,);
        document.addEventListener("keydown", this.onKeyDown)
    }

    public componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown);
    }

    public render() {
        return (
            <div onClick={this.onClick} className={"Button"}>
                {this.props.caption}
            </div>
        );
    }

    private onClick = () => {
        buttonClick(this.props.action, this.props.tag)
    };

    private onKeyDown = (e: KeyboardEvent) => {
        if (e.key === this.props.keybind) {
            this.onClick()
        }
        // console.log(e)
    }
}

export default CalcButton;
