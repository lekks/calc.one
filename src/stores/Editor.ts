
export class Editor {
    private expression: string = "";
    getInput(): string {
        return this.expression;
    }

    addSymbol(expr: string) {
        this.expression += expr;
    }

    clear() {
        this.expression = "";
    }

    backSpace(): boolean {
        if (this.expression.length > 0) {
            this.expression = this.expression.slice(0, -1);
            return true;
        }
        return false;
    }

    notEmpty():boolean {
        return this.expression.length !== 0;
    }

}
