import {BehaviorSubject, Subject} from "rxjs";
import {filter, mergeAll, scan} from "rxjs/operators";

export class Editor {
    public static readonly CLEAR_SYMBOL = "DEL"
    public static readonly BS_SYMBOL = "BS"
    private static readonly allowedSymbols: string[] = [
        '.', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        Editor.CLEAR_SYMBOL, Editor.BS_SYMBOL
    ];
    public readonly symbolInput = new Subject<string>();
    public readonly stringInput = new Subject<string>();
    public readonly expression = new BehaviorSubject<string>("");

    constructor() {
        this.stringInput.pipe(mergeAll()).subscribe(this.symbolInput)
        this.symbolInput.pipe(
            filter(value => Editor.allowedSymbols.includes(value)),
            scan(Editor.symbolReducer, "")
        ).subscribe(this.expression);
    }

    private static symbolReducer(acc: string, expr: string) {
        if (expr === Editor.BS_SYMBOL) {
            if (acc.length > 0) {
                return acc.slice(0, -1);
            } else {
                return acc;
            }
        }
        if (expr === Editor.CLEAR_SYMBOL) {
            return ""
        }
        if (expr === ',')
            expr = '.'
        if (expr === '.' && acc.indexOf(expr) !== -1)
            return acc;
        return acc + expr;
    }

    getInput(): string {
        return this.expression.getValue();
    }

    notEmpty(): boolean {
        return this.expression.getValue().length !== 0;
    }

    addSymbol(symbol: string) {
        return this.symbolInput.next(symbol);
    }
}
