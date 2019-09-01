import {EventEmitter} from 'fbemitter';

import {AppDispatcher, Event} from "../dispatcher/AppDispatcher";
import Actions from "../dispatcher/Actions";

export type ExpressionType = string;
export type ResultType = string;

export enum ExpressionEvents {
    CHANGE_EVENT = "CHANGE_EVENT",
}

class ExpressionStore {
    private expression: ExpressionType = "";
    private result: ResultType = "";
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

    getExpression(): ExpressionType {
        return this.expression;
    }

    getResult(): ResultType {
        return this.result;
    }

    addChangeListener(event: ExpressionEvents, callback: () => void) {
        return this.emitter.addListener(event, callback);
    }

    reactActions(action: Event) {
        switch (action.action) {
            case Actions.ADD_NUMBER:
            case Actions.OPERATION:
                this.addExpression(action.payload);
                this.emitter.emit(ExpressionEvents.CHANGE_EVENT);
                break;
            case Actions.CLEAR:
                this.clear();
                this.emitter.emit(ExpressionEvents.CHANGE_EVENT);
                break;
            case Actions.BS:
                if (this.backSpace()) {
                    this.emitter.emit(ExpressionEvents.CHANGE_EVENT);
                }
                break;
        }
    }

    private evaluate() {
        try {
            // eslint-disable-next-line no-eval
            this.result = eval(this.expression);
        } catch (e) {
            this.result = "?";
        }
    }

    private addExpression(expr: string) {
        this.expression += expr;
        this.evaluate();
    }

    private clear() {
        this.expression = "";
        this.result = "";
    }

    private backSpace(): boolean {
        if (this.expression.length > 0) {
            this.expression = this.expression.slice(0, -1);
            this.evaluate();
            return true;
        }
        return false;
    }
}

const expressionStore = new ExpressionStore();
export {expressionStore};
