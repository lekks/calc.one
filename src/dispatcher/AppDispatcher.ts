import {Dispatcher} from 'flux';
import Actions from "./Actions";

export class TypedEvent<P> {
  constructor(public action: Actions, public payload: P) {
  }
}

export type Event = TypedEvent<any>;
export const AppDispatcher: Dispatcher<Event> = new Dispatcher();
