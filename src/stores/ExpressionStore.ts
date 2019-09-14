import {EventEmitter} from 'fbemitter';

import {AppDispatcher, Event} from "../dispatcher/AppDispatcher";
import Actions from "../dispatcher/Actions";


export class Expression  { //TODO Move out
    formula: string;
    result: number = NaN;
    constructor(formula: string) {
        this.formula = formula
    }
} ;

export type InputType = string;
export type Result = string;

export enum ExpressionEvents {
    INPUT_CHANGE_EVENT = "INPUT_CHANGE_EVENT",
    STACK_CHANGE_EVENT = "STACK_CHANGE_EVENT",
}

class ExpressionStore {
    private expression: InputType = "";
    private result: Result = "";
    private stack: Expression[] = [];
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

    getInput(): InputType {
        return this.expression;
    }

    getResult(): Result {
        return this.result;
    }

    getStack(): Expression[] {
        return this.stack;
    }

    addChangeListener(event: ExpressionEvents, callback: () => void) {
        return this.emitter.addListener(event, callback);
    }

    push():boolean {
        this.stack.push(new Expression(this.expression));
        // this.clear();
        return true
    }

    reactActions(action: Event) {
        switch (action.action) {
            case Actions.ADD_NUMBER:
            case Actions.OPERATION:
                this.addInput(action.payload);
                this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
                break;
            case Actions.CLEAR:
                this.clear();
                this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
                break;
            case Actions.BS:
                if (this.backSpace()) {
                    this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
                }
                break;
            case Actions.ENTER:
                if (this.push()) {
                    this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
                    this.emitter.emit(ExpressionEvents.STACK_CHANGE_EVENT);
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

    private addInput(expr: string) {
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
