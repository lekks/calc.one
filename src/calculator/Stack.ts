import {BehaviorSubject, Subject} from "rxjs";
import {Expression} from "./Expression";
import {map} from "rxjs/operators";
import {StackItem} from "./Calculator";

export class Stack {

    public readonly expressionStack = new Subject<StackItem[]>();
    public readonly stackResult = new BehaviorSubject<StackItem | undefined>(undefined);
    private stack: Expression[] = [];
    private history: Expression[][] = [];

    constructor() {
        this.expressionStack.pipe(
            map((stack: StackItem[]) =>
                stack[this.stack.length - 1] ? stack[this.stack.length - 1] : undefined
            )
        ).subscribe(this.stackResult);
    }

    public backSpace() {
        if (this.popHistory()) {
            this.publishStack()
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

    public getLength() {
        return this.stack.length
    }

    public getTop(num: number): Expression[] {
        this.stashHistory();
        return this.stack.splice(-num, num);
    }

    public addOperation(expr: Expression) {
        this.stack.push(expr);
        this.publishStack()
    }

    public push(expr: Expression) {
        this.stashHistory();
        this.stack.push(expr);
        this.publishStack()
    }

    public duplicate() {
        if (this.stack.length > 0) {
            this.stashHistory();
            this.stack.push(this.stack[this.stack.length - 1]);
            this.publishStack()
        }
    }

    public swap() {
        if (this.stack.length >= 2) {
            this.stashHistory();
            [this.stack[this.stack.length - 1], this.stack[this.stack.length - 2]] = [this.stack[this.stack.length - 2], this.stack[this.stack.length - 1]];
            this.publishStack()
        }
    }

    public clear() {
        this.history = [];
        this.stack = [];
        this.publishStack()
    }

    public del() {
        if (this.stack.length > 0) {
            this.stashHistory();
            this.stack.pop();
            this.publishStack()
        }
    }

    private getStack(): StackItem[] {
        return this.stack.map((expr) => ({
            texFormula: expr.getTex(),
            result: expr.getResult()
        }));
    }

    private publishStack() {
        this.expressionStack.next(this.getStack())
    }

    private stashHistory() {
        this.history.push([...this.stack]);
    }


}