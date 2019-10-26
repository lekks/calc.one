import {EventEmitter} from 'fbemitter';

import {AppDispatcher, Event} from "../dispatcher/AppDispatcher";
import Actions from "../dispatcher/Actions";
import {Expression, NumberExpression} from "../expression/Expression";
import {Editor} from "./Editor";
import ops from "../expression/operations";

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
    private history: Expression[][] = [];

    constructor() {
        this.dispatcher = AppDispatcher;
        this.emitter = new EventEmitter();
        this.dispatchToken = this.dispatcher.register(payload => {
            this.reactActions(payload);
        });
    }

    public getInput(): string {
        return this.editor.getInput();
    }


    public getStack(): Expression[] {
        return this.stack;
    }

    public addChangeListener(event: ExpressionEvents, callback: () => void) {
        return this.emitter.addListener(event, callback);
    }

    private reactActions(action: Event) {
        switch (action.action) {
            case Actions.ADD_NUMBER:
                if (this.editor.addSymbol(action.payload)) {
                    this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
                }
                break;
            case Actions.OPERATION:
                if (this.addOperation(action.payload)) {
                    this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
                    this.emitter.emit(ExpressionEvents.STACK_CHANGE_EVENT);
                }
                break;
            case Actions.DEL:
                this.del();
                break;
            case Actions.CLEAR:
                this.clear();
                break;
            case Actions.BS:
                this.backSpace();
                break;
            case Actions.ENTER:
                if (this.push()) {
                    this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
                    this.emitter.emit(ExpressionEvents.STACK_CHANGE_EVENT);
                }
                break;
            case Actions.SWAP:
                this.swap();
                break;
        }
    }

    private backSpace() {
        if (this.editor.backSpace()) {
            this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
        } else if (this.popHistory()) {
            this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
            this.emitter.emit(ExpressionEvents.STACK_CHANGE_EVENT);
        }

    }

    private popHistory(): boolean {
        const last = this.history.pop();
        console.log("Restore ", this.history.length);

        if (last) {
            this.stack = last;
            return true;
        } else {
            return false
        }
    }

    private stashHistory() {
        this.history.push([...this.stack]);
        console.log("Save ", this.history.length);
    }

    private push(): boolean {
        if (this.editor.notEmpty()) {
            this.stashHistory();
            this.stack.push(this.editorExpression());
            this.editor.clear();
            return true
        } else if (this.stack.length > 0) {
            this.stashHistory();
            this.stack.push(this.stack[this.stack.length - 1]);
            return true
        } else {
            return false
        }
    }

    private swap() {
        if (this.stack.length >= 2) {
            this.stashHistory();
            [this.stack[this.stack.length - 1], this.stack[this.stack.length - 2]] = [this.stack[this.stack.length - 2], this.stack[this.stack.length - 1]];
            this.emitter.emit(ExpressionEvents.STACK_CHANGE_EVENT);
        }
    }

    private clear() {
        this.editor.clear();
        this.history = [];
        this.stack = [];
        this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
        this.emitter.emit(ExpressionEvents.STACK_CHANGE_EVENT);
    }


    private del() {
        if (this.editor.notEmpty()) {
            this.editor.clear();
            this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT);
        } else if (this.stack.length > 0) {
            this.stashHistory();
            this.stack.pop();
            this.emitter.emit(ExpressionEvents.STACK_CHANGE_EVENT);
        }
    }

    private editorExpression(): Expression {
        return new NumberExpression(this.editor.getInput())
    }

    private addOperation(oper: string): boolean {
        if (!ops.defined(oper)) {
            return false
        }
        const opnNum: number = ops.operandsNumber(oper);
        const stackGet = opnNum - (this.editor.notEmpty() ? 1 : 0);
        if (stackGet > this.stack.length) {
            return false
        }
        this.stashHistory();
        const operandsExpr = this.stack.splice(-stackGet, stackGet);
        if (this.editor.notEmpty()) {
            operandsExpr.push(this.editorExpression());
            this.editor.clear();
        }
        this.stack.push(ops.buildExpression(oper, ...operandsExpr));
        return true;
    }

}

const expressionStore = new ExpressionStore();
export {expressionStore};
