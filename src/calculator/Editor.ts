export class Editor {
    private static readonly allowed: string = ".0123456789";
    private expression: string = "";

    getInput(): string {
        return this.expression;
    }

    addSymbol(expr: string): boolean {
        if (expr.length !== 1)
            return false;
        if (Editor.allowed.indexOf(expr) === -1)
            return false;
        if (expr === '.' && this.expression.indexOf(expr) !== -1)
            return false;
        this.expression += expr;
        return true
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

    notEmpty(): boolean {
        return this.expression.length !== 0;
    }

}
