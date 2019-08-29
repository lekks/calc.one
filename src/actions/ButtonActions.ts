import {AppDispatcher, TypedEvent} from '../dispatcher/AppDispatcher';
import Actions from "./Actions";

class ButtonClick extends TypedEvent<string> {}

export function buttonClick(tag: string) {
  AppDispatcher.dispatch(new ButtonClick(Actions.ADD_NUMBER, tag));
}
