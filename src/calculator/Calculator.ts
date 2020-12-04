import {Editor} from "./Editor";
import {Expression, NumberExpression} from "./Expression";
import ops from "./operations";
import {Subject} from "rxjs"

export interface StackItem {
    readonly texFormula: string
    readonly result: number
}

export class Calculator {
    public readonly editorText = new Subject<string>();
    public readonly expressionStack = new Subject<StackItem[]>();
    private editor: Editor = new Editor();
    private stack: Expression[] = [];
    private history: Expression[][] = [];

    public getStack(): StackItem[] {
        return this.stack.map((expr) => ({
            texFormula: expr.getTex(),
            result: expr.getResult()
        }));
    }

    public backSpace() {
        if (this.editor.backSpace()) {
            this.onInputChange();
        } else if (this.popHistory()) {
            this.onInputChange();
            this.onStackChange();
        }
    }

    public popHistory(): boolean {
        const last = this.history.pop();

        if (last) {
            this.stack = last;
            return true;
        } else {
            return false
        }
    }

    public stashHistory() {
        this.history.push([...this.stack]);
    }

    public push() {
        if (this.editor.notEmpty()) {
            this.stashHistory();
            this.stack.push(this.editorExpression());
            this.editor.clear();
            this.onInputChange();
            this.onStackChange();
        } else if (this.stack.length > 0) {
            this.stashHistory();
            this.stack.push(this.stack[this.stack.length - 1]);
            this.onInputChange();
            this.onStackChange();
        }
    }

    public swap() {
        if (this.stack.length >= 2) {
            this.stashHistory();
            [this.stack[this.stack.length - 1], this.stack[this.stack.length - 2]] = [this.stack[this.stack.length - 2], this.stack[this.stack.length - 1]];
            this.onStackChange();
        }
    }

    public clear() {
        this.editor.clear();
        this.history = [];
        this.stack = [];
        this.onInputChange();
        this.onStackChange();
    }

    public del() {
        if (this.editor.notEmpty()) {
            this.editor.clear();
            this.onInputChange();
        } else if (this.stack.length > 0) {
            this.stashHistory();
            this.stack.pop();
            this.onStackChange();
        }
    }

    public editorExpression(): Expression {
        return new NumberExpression(this.editor.getInput())
    }

    public addOperation(oper: string) {
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
            this.editor.clear();
        }
        this.stack.push(ops.buildExpression(oper, ...operandsExpr));
        this.onInputChange();
        this.onStackChange();
    }

    public addNumber(expr: string) {
        if (this.editor.addSymbol(expr)) {
            this.onInputChange();
        }
    }

    private onInputChange() {
        this.editorText.next(this.editor.getInput())
    }

    private onStackChange() {
        this.expressionStack.next(this.getStack())
    }

}