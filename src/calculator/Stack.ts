import {Observable, Subject} from "rxjs";
import {Expression} from "./Expression";

export class Stack {
    private readonly expressionStack = new Subject<Expression[]>();
    private stack: Expression[] = [];
    private history: Expression[][] = [];

    public getExpressionsObservable(): Observable<Expression[]> {
        return this.expressionStack.asObservable();
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

    private publishStack() {
        this.expressionStack.next(this.stack)
    }

    private stashHistory() {
        this.history.push([...this.stack]);
    }


}