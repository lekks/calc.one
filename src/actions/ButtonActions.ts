import {AppDispatcher, TypedEvent} from '../dispatcher/AppDispatcher';
import Actions from "./Actions";

export function buttonClick(action: Actions, tag: string) {
    AppDispatcher.dispatch(new TypedEvent<string>(action, tag));
}
