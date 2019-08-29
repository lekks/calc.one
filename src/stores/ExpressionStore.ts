// import {ReduceStore} from 'flux/utils';
import { EventEmitter } from 'fbemitter';
import * as Flux from "flux";

import {Event, AppDispatcher} from "../dispatcher/AppDispatcher";

export type Expression = string;
const CHANGE_EVENT = 'change';

class ExpressionStore {
    private state:string = ":";
    private emitter: EventEmitter;
    private dispatcher: Flux.Dispatcher<Event>;

    private dispatchToken: string;

    constructor() {
        this.dispatcher = AppDispatcher;
        this.emitter = new EventEmitter();
        this.dispatchToken = this.dispatcher.register(payload => {
            this.invokeOnDispatch(payload);
        });

    }
    getState() {
        return this.state;
    }
    addChangeListener(callback: () => void) {
        return this.emitter.addListener(CHANGE_EVENT, callback);
    }

    invokeOnDispatch(action: Event) {
        this.state += action.payload;
        this.emitter.emit(CHANGE_EVENT);
    }


}


const expressionStore = new ExpressionStore();
export {expressionStore};
