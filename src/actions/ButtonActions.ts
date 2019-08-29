import {TypedEvent, AppDispatcher} from '../dispatcher/AppDispatcher';

export class ButtonClick extends TypedEvent<string> {}

export function buttonClick(tag: string) {
  AppDispatcher.dispatch(new ButtonClick(tag));
}
