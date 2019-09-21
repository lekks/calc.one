import {EventEmitter} from 'fbemitter';

import {AppDispatcher, Event} from "../dispatcher/AppDispatcher";
import Actions from "../dispatcher/Actions";
import {AriphmeticExpression, Expression, NumberExpression} from "./Expression";
import {Editor} from "./Editor";
import {operations} from "./operations";

export enum ExpressionEvents {
    INPUT_CHANGE_EVENT = "INPUT_CHANGE_EVENT",
    STACK_CHANGE_EVENT = "STACK_CHANGE_EVENT",
}


class ExpressionStore {
    private editor: Editor = new Editor();
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

    getInput(): string {
        return this.editor.getInput();
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
                this.editor.addSymbol(action.payload);
                this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
                break;
            case Actions.OPERATION:
                if (this.addOperation(action.payload)) {
                    this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
                    this.emitter.emit(ExpressionEvents.STACK_CHANGE_EVENT);
                }
                break;
            case Actions.CLEAR:
                this.editor.clear();
                this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
                break;
            case Actions.BS:
                if (this.editor.backSpace()) {
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

    push(): boolean {
        if (this.editor.notEmpty()) {
            this.stack.push(this.editorExpression());
            this.editor.clear();
            return true
        } else {
            return false
        }
    }

    private editorExpression(): Expression {
        return new NumberExpression(this.editor.getInput())
    }

    private addOperation(oper: string): boolean {
        const {operandsNumber, rank} = operations[oper];
        const stackGet = operandsNumber - (this.editor.notEmpty() ? 1 : 0);
        if (stackGet > this.stack.length) {
            return false
        }
        const operandsExpr = this.stack.splice(-stackGet, stackGet);
        if (this.editor.notEmpty()) {
            operandsExpr.push(this.editorExpression());
            this.editor.clear();
        }
        const combinedExpression = new AriphmeticExpression(rank, oper, ...operandsExpr.reverse())
        this.stack.push(combinedExpression);
        return true;
    }

}

const expressionStore = new ExpressionStore();
export {expressionStore};
