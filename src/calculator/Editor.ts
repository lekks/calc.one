import {Observable, Observer, Subject} from "rxjs";
import {filter, map, mergeAll, scan} from "rxjs/operators";

export interface EditorSignals {
    outputText?: Observer<string>,
    outputValue?: Observer<number>,
    inputSymbols?: Observable<string>,
    inputString?: Observable<string>
}

export const CLEAR_SYMBOL = "DEL"
export const BS_SYMBOL = "BS"

export class Editor {
    private static readonly allowedSymbols: string[] = [
        '.', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        CLEAR_SYMBOL, BS_SYMBOL
    ];
    private readonly symbolInput = new Subject<string>();
    private readonly stringInput = new Subject<string>();
    private readonly expression = new Subject<string>();
    private readonly value = new Subject<number>();

    constructor(extern: EditorSignals) {
        this.expression.subscribe(extern.outputText)
        this.value.subscribe(extern.outputValue)
        extern.inputSymbols?.subscribe(this.symbolInput)
        extern.inputString?.subscribe(this.stringInput)

        this.stringInput.pipe(mergeAll()).subscribe(this.symbolInput)
        this.symbolInput.pipe(
            filter(value => Editor.allowedSymbols.includes(value)),
            scan(Editor.symbolReducer, "")
        ).subscribe(this.expression);
        this.expression.pipe(map(str => str.length ? Number(str) : NaN)).subscribe(this.value)
    }

    private static symbolReducer(acc: string, expr: string) {
        if (expr === BS_SYMBOL) {
            if (acc.length > 0) {
                return acc.slice(0, -1);
            } else {
                return acc;
            }
        }
        if (expr === CLEAR_SYMBOL) {
            return ""
        }
        if (expr === ',')
            expr = '.'
        if (expr === '.' && acc.indexOf(expr) !== -1)
            return acc;
        return acc + expr;
    }

}
