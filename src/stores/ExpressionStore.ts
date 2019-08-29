import { EventEmitter } from 'fbemitter';

import {Event, AppDispatcher} from "../dispatcher/AppDispatcher";
import Actions from "../actions/Actions";

export type ExpressionType = string;
export type ResultType = string;
const CHANGE_EVENT = 'change';

class ExpressionStore {
    private expression:ExpressionType = "";
    private result:ResultType = "";
    private emitter: EventEmitter;
    private dispatcher: typeof AppDispatcher;
    private dispatchToken: string;

    constructor() {
        this.dispatcher = AppDispatcher;
        this.emitter = new EventEmitter();
        this.dispatchToken = this.dispatcher.register(payload => {
            this.reactActions(payload);
        });
    }

    getExpression():ExpressionType {
        return this.expression;
    }
    getResult():ResultType {
        return this.result;
    }

    addChangeListener(callback: () => void) {
        return this.emitter.addListener(CHANGE_EVENT, callback);
    }

    private addExpression(expr:string) {
        this.expression += expr;
        try {
            // eslint-disable-next-line no-eval
            this.result = eval(this.expression);
        } catch (e) {
            this.result = "?";
        }
    }

    reactActions(action: Event) {
        switch (action.action) {
            case Actions.ADD_NUMBER:
                this.addExpression(action.payload);
                this.emitter.emit(CHANGE_EVENT);
            break;
        }
    }
}


const expressionStore = new ExpressionStore();
export {expressionStore};
