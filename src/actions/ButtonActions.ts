import {AppDispatcher, TypedEvent} from '../dispatcher/AppDispatcher';
import Actions from "./Actions";

class ButtonClick extends TypedEvent<string> {
}

export function buttonClick(action: Actions, tag: string) {
    AppDispatcher.dispatch(new ButtonClick(action, tag));
}
