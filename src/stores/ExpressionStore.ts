import {EventEmitter} from 'fbemitter';

import {AppDispatcher, Event} from "../dispatcher/AppDispatcher";
import Actions from "../actions/Actions";

export type ExpressionType = string;
export type ResultType = string;
const CHANGE_EVENT = 'change';

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

    addChangeListener(callback: () => void) {
        return this.emitter.addListener(CHANGE_EVENT, callback);
    }

    reactActions(action: Event) {
        switch (action.action) {
            case Actions.ADD_NUMBER:
                this.addExpression(action.payload);
                this.emitter.emit(CHANGE_EVENT);
                break;
            case Actions.CLEAR:
                this.clear();
                this.emitter.emit(CHANGE_EVENT);
                break;
            case Actions.BS:
                if (this.backSpace()) {
                    this.emitter.emit(CHANGE_EVENT);
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
            this.expression = this.expression.slice(0, this.expression.length - 1);
            this.evaluate();
            return true;
        }
        return false;
    }
}

const expressionStore = new ExpressionStore();
export {expressionStore};
