import React from 'react';
import {Subject} from "rxjs";
import {CalcInputEvent, CalcInputType} from "../calculator/Calculator";


interface Props {
    caption: string;
    tag?: string;
    action: CalcInputType;
    keybind?: string;
    subject: Subject<CalcInputEvent>;
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
        this.props.subject.next({type: this.props.action, payload: this.props.tag})
    };

    private onKeyDown = (e: KeyboardEvent) => {
        if (e.key === this.props.keybind) {
            this.onClick()
        }
        // console.log(e)
    }
}

export default CalcButton;
