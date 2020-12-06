import {Editor} from "./Editor";
import {Expression, NumberExpression} from "./Expression";
import ops from "./operations";
import {Subject} from "rxjs"

export interface StackItem {
    readonly texFormula: string
    readonly result: number
}

export enum CalcInputType {
    ADD_NUMBER,
    OPERATION,
    ENTER,
    SWAP,
    BS,
    DEL,
    CLEAR
}

export interface CalcInputEvent {
    type: CalcInputType;
    payload?: string;
}


export class Calculator {

    public readonly editorText = new Subject<string>();
    public readonly expressionStack = new Subject<StackItem[]>();
    public readonly calcInputEvent = new Subject<CalcInputEvent>();
    private editor: Editor = new Editor();
    private stack: Expression[] = [];
    private history: Expression[][] = [];

    constructor() {
        this.calcInputEvent.subscribe((event) => this.processInputEvent(event))
    }

    private getStack(): StackItem[] {
        return this.stack.map((expr) => ({
            texFormula: expr.getTex(),
            result: expr.getResult()
        }));
    }

    private backSpace() {
        if (this.editor.notEmpty()) {
            this.editor.addSymbol(Editor.BS_SYMBOL)
            this.onInputChange();
        } else if (this.popHistory()) {
            this.onInputChange();
            this.onStackChange();
        }
    }

    private popHistory(): boolean {
        const last = this.history.pop();

        if (last) {
            this.stack = last;
            return true;
        } else {
            return false
        }
    }

    private stashHistory() {
        this.history.push([...this.stack]);
    }

    private push() {
        if (this.editor.notEmpty()) {
            this.stashHistory();
            this.stack.push(this.editorExpression());
            this.editor.addSymbol(Editor.CLEAR_SYMBOL);
            this.onInputChange();
            this.onStackChange();
        } else if (this.stack.length > 0) {
            this.stashHistory();
            this.stack.push(this.stack[this.stack.length - 1]);
            this.onInputChange();
            this.onStackChange();
        }
    }

    private swap() {
        if (this.stack.length >= 2) {
            this.stashHistory();
            [this.stack[this.stack.length - 1], this.stack[this.stack.length - 2]] = [this.stack[this.stack.length - 2], this.stack[this.stack.length - 1]];
            this.onStackChange();
        }
    }

    private clear() {
        this.editor.addSymbol(Editor.CLEAR_SYMBOL);
        this.history = [];
        this.stack = [];
        this.onInputChange();
        this.onStackChange();
    }

    private del() {
        if (this.editor.notEmpty()) {
            this.editor.addSymbol(Editor.CLEAR_SYMBOL);
            this.onInputChange();
        } else if (this.stack.length > 0) {
            this.stashHistory();
            this.stack.pop();
            this.onStackChange();
        }
    }

    private editorExpression(): Expression {
        return new NumberExpression(this.editor.getInput())
    }

    private addOperation(oper: string) {
        if (!ops.defined(oper)) {
            return
        }
        const opnNum: number = ops.operandsNumber(oper);
        const stackGet = opnNum - (this.editor.notEmpty() ? 1 : 0);
        if (stackGet > this.stack.length) {
            return
        }
        this.stashHistory();
        const operandsExpr = this.stack.splice(-stackGet, stackGet);
        if (this.editor.notEmpty()) {
            operandsExpr.push(this.editorExpression());
            this.editor.addSymbol(Editor.CLEAR_SYMBOL);
        }
        this.stack.push(ops.buildExpression(oper, ...operandsExpr));
        this.onInputChange();
        this.onStackChange();
    }

    private addNumber(expr: string) {
        this.editor.addSymbol(expr);
        this.onInputChange();
    }

    private onInputChange() {
        this.editorText.next(this.editor.getInput())
    }

    private onStackChange() {
        this.expressionStack.next(this.getStack())
    }


    private processInputEvent(event: CalcInputEvent) {
        switch (event.type) {
            case CalcInputType.ADD_NUMBER:
                event.payload && this.addNumber(event.payload);
                break;
            case CalcInputType.OPERATION:
                event.payload && this.addOperation(event.payload);
                break;
            case CalcInputType.DEL:
                this.del();
                break;
            case CalcInputType.CLEAR:
                this.clear();
                break;
            case CalcInputType.BS:
                this.backSpace();
                break;
            case CalcInputType.ENTER:
                this.push();
                break;
            case CalcInputType.SWAP:
                this.swap();
                break;
        }
    }

}