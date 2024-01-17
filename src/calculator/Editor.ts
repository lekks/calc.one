import {Observable, Observer, Subject, Subscription} from "rxjs";
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

    private subscriptions: Subscription = new Subscription();

    constructor(extern: EditorSignals) {
        this.subscriptions.add(this.expression.subscribe(extern.outputText))
        this.subscriptions.add(this.value.subscribe(extern.outputValue))
        this.subscriptions.add(extern.inputSymbols?.subscribe(this.symbolInput))
        this.subscriptions.add(extern.inputString?.subscribe(this.stringInput))

        this.subscriptions.add(this.stringInput.pipe(mergeAll()).subscribe(this.symbolInput))
        this.subscriptions.add(this.symbolInput.pipe(
            filter(value => Editor.allowedSymbols.includes(value)),
            scan(Editor.symbolReducer, "")
        ).subscribe(this.expression))
        this.subscriptions.add(this.expression.pipe(map(str => str.length ? Number(str) : NaN)).subscribe(this.value))
    }

    public destroy() {
        this.subscriptions.unsubscribe()
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
