import {Editor} from "./Editor";
import {Expression, NumberExpression} from "./Expression";
import ops from "./operations";
import {BehaviorSubject, combineLatest, Subject} from "rxjs"
import {distinctUntilChanged, map} from "rxjs/operators";
import {Stack} from "./Stack";


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

export interface StackItem {
    readonly texFormula: string
    readonly result: number
}

export class Calculator {

    public readonly editorText = new Subject<string>();
    public readonly calcInputEvent = new Subject<CalcInputEvent>();
    public readonly calcEditorStringInput = new Subject<string>();
    public readonly clipboardOutput = new BehaviorSubject<number>(NaN);
    public readonly stackResult = new BehaviorSubject<StackItem | undefined>(undefined);
    public readonly expressionStack = new Subject<StackItem[]>();
    private editor: Editor = new Editor();
    private stack = new Stack();

    constructor() {
        this.calcInputEvent.subscribe(this.processInputEvent.bind(this))
        this.editor.expression.subscribe(this.editorText)
        this.calcEditorStringInput.subscribe(this.editor.stringInput)
        this.stack.stackResult.subscribe(this.stackResult)
        this.stack.expressionStack.subscribe(this.expressionStack)

        combineLatest([this.editor.value, this.stack.stackResult]).pipe(
            map(([editor, stack]) => {
                return !isNaN(editor) ? editor : (stack ? stack.result : NaN)
            }),
            distinctUntilChanged()
        ).subscribe(this.clipboardOutput)

    }

    private backSpace() {
        if (this.editor.notEmpty()) {
            this.editor.addSymbol(Editor.BS_SYMBOL)
        } else {
            this.stack.backSpace()
        }
    }

    private push() {
        if (this.editor.notEmpty()) {
            this.stack.push(this.editorExpression());
            this.editor.addSymbol(Editor.CLEAR_SYMBOL);
        } else {
            this.stack.duplicate()
        }
    }

    private clear() {
        this.editor.addSymbol(Editor.CLEAR_SYMBOL);
        this.stack.clear()
    }

    private del() {
        if (this.editor.notEmpty()) {
            this.editor.addSymbol(Editor.CLEAR_SYMBOL);
        } else {
            this.stack.del()
        }
    }

    private editorExpression(): Expression {
        return new NumberExpression(this.editor.getInput())
    }

    private addOperation(oper: string) {
        // operation is unknown
        if (!ops.defined(oper)) {
            return
        }

        // we must have in stack as much items as we need for operation
        const opnNum: number = ops.operandsNumber(oper);
        const stackGet = opnNum - (this.editor.notEmpty() ? 1 : 0);
        if (stackGet > this.stack.getLength()) {
            return
        }

        const operandsExpr = this.stack.getTop(stackGet)

        if (this.editor.notEmpty()) {
            operandsExpr.push(this.editorExpression());
            this.editor.addSymbol(Editor.CLEAR_SYMBOL);
        }
        this.stack.addOperation(ops.buildExpression(oper, ...operandsExpr));
    }

    private addNumber(expr: string) {
        this.editor.addSymbol(expr);
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
                this.stack.swap();
                break;
        }
    }

}