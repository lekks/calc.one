import {EventEmitter} from 'fbemitter';

import {AppDispatcher, Event} from "../dispatcher/AppDispatcher";
import Actions from "../dispatcher/Actions";
import {AriphmeticExpression, Expression, NumberExpression} from "./Expression";

export type InputType = string;

export enum ExpressionEvents {
    INPUT_CHANGE_EVENT = "INPUT_CHANGE_EVENT",
    STACK_CHANGE_EVENT = "STACK_CHANGE_EVENT",
}

class ExpressionStore {
    private expression: InputType = "";
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


    getStack(): Expression[] {
        return this.stack;
    }

    addChangeListener(event: ExpressionEvents, callback: () => void) {
        return this.emitter.addListener(event, callback);
    }

    reactActions(action: Event) {
        switch (action.action) {
            case Actions.ADD_NUMBER:
                this.addInput(action.payload);
                this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
                break;
            case Actions.OPERATION:
                if (this.addOperation(action.payload)) {
                    this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
                    this.emitter.emit(ExpressionEvents.STACK_CHANGE_EVENT);
                }
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


    private addInput(expr: string) {
        this.expression += expr;
    }

    private currentExpression():Expression {
        return new NumberExpression(this.expression)
    }

    private addOperation(oper: string): boolean {
        const lastExpressopn:Expression | undefined = this.stack.pop();
        if (lastExpressopn) {
            this.stack.push(new AriphmeticExpression(oper, lastExpressopn, this.currentExpression()));
            this.clear();
            return true;
        } else {
            return false; //TODO show error
        }
    }

    push():boolean {
        this.stack.push(this.currentExpression());
        this.clear();
        return true
    }

    private clear() {
        this.expression = "";
    }

    private backSpace(): boolean {
        if (this.expression.length > 0) {
            this.expression = this.expression.slice(0, -1);
            return true;
        }
        return false;
    }
}

const expressionStore = new ExpressionStore();
export {expressionStore};
