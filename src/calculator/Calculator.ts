import {BS_SYMBOL, CLEAR_SYMBOL, Editor} from "./Editor";
import {Expression, NumberExpression} from "./Expression";
import ops from "./operations";
import {BehaviorSubject, combineLatest, Observable, Observer, Subject} from "rxjs"
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

export interface CalculatorSignals {
    inputEvent?: Observable<CalcInputEvent>,
    editorTextInput?: Observable<string>,
    result?: Observer<number>
    editorText?: Observer<string>,
    expressionStack?: Observer<StackItem[]>
    stackResult?: Observer<StackItem | undefined>;
}

export class Calculator {

    private readonly calcResult = new Subject<StackItem | undefined>();
    private readonly expressionStack = new Subject<StackItem[]>();
    private readonly stack = new Stack();
    private readonly editorText = new BehaviorSubject<string>("")
    private readonly editorValue = new BehaviorSubject<number>(NaN)
    private readonly editorInputSymbols = new Subject<string>();
    private readonly editorInputString = new Subject<string>();
    private readonly editor = new Editor({
        outputText: this.editorText,
        inputSymbols: this.editorInputSymbols,
        inputString: this.editorInputString,
        outputValue: this.editorValue
    });

    constructor(extern: CalculatorSignals) {
        extern.inputEvent?.subscribe(this.processInputEvent.bind(this))
        extern.editorTextInput?.subscribe(this.editorInputString)

        this.stack.getExpressionsObservable().pipe(
            map((exprStack: Expression[]): StackItem[] => exprStack.map((expr: Expression): StackItem => {
                return {
                    texFormula: expr.getTex(),
                    result: expr.getResult()
                }
            }))
        ).subscribe(this.expressionStack)

        this.expressionStack.pipe(
            map((stack: StackItem[]) =>
                stack[stack.length - 1] ? stack[stack.length - 1] : undefined
            )
        ).subscribe(this.calcResult);

        combineLatest([this.editorValue, this.calcResult]).pipe(
            map(([editor, stack]) => {
                return !isNaN(editor) ? editor : (stack ? stack.result : NaN)
            }),
            distinctUntilChanged()
        ).subscribe(extern.result)
        this.expressionStack.subscribe(extern.expressionStack)
        this.calcResult.subscribe(extern.stackResult)
        this.editorText.subscribe(extern.editorText)

    }

    private editorExpression(): Expression {
        return new NumberExpression(this.editorText.getValue())
    }

    private editorNotEmpty(): boolean {
        return this.editorText.getValue().length !== 0;
    }


    private addOperation(oper: string) {
        // operation is unknown
        if (!ops.defined(oper)) {
            return
        }

        // we must have in stack as much items as we need for operation
        const opnNum: number = ops.operandsNumber(oper);
        const stackGet = opnNum - (this.editorNotEmpty() ? 1 : 0);
        if (stackGet > this.stack.getLength()) {
            return
        }

        const operandsExpr: Expression[] = this.stack.getTop(stackGet)

        if (this.editorNotEmpty()) {
            operandsExpr.push(this.editorExpression());
            this.editorInputSymbols.next(CLEAR_SYMBOL);
        }
        this.stack.addOperation(ops.buildExpression(oper, ...operandsExpr));
    }

    private processInputEvent(event: CalcInputEvent) {
        switch (event.type) {
            case CalcInputType.ADD_NUMBER:
                event.payload && this.editorInputSymbols.next(event.payload);
                break;
            case CalcInputType.OPERATION:
                event.payload && this.addOperation(event.payload);
                break;
            case CalcInputType.DEL:
                if (this.editorNotEmpty()) {
                    this.editorInputSymbols.next(CLEAR_SYMBOL);
                } else {
                    this.stack.del()
                }
                break;
            case CalcInputType.CLEAR:
                this.editorInputSymbols.next(CLEAR_SYMBOL);
                this.stack.clear()
                break;
            case CalcInputType.BS:
                if (this.editorNotEmpty()) {
                    this.editorInputSymbols.next(BS_SYMBOL)
                } else {
                    this.stack.backSpace()
                }
                break;
            case CalcInputType.ENTER:
                if (this.editorNotEmpty()) {
                    this.stack.push(this.editorExpression());
                    this.editorInputSymbols.next(CLEAR_SYMBOL);
                } else {
                    this.stack.duplicate()
                }
                break;
            case CalcInputType.SWAP:
                if (this.editorNotEmpty()) {
                    this.stack.push(this.editorExpression());
                    this.editorInputSymbols.next(CLEAR_SYMBOL);
                }
                this.stack.swap();
                break;
        }
    }
}