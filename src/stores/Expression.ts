export type Result = string;

export class Expression {
    formula: string;
    result_value: number = NaN;

    constructor(formula: string) {
        this.formula = formula;
        this.evaluate();
    }

    getResult(): Result {
        return isNaN(this.result_value) ? "?" : String(this.result_value);
    }

    private evaluate() {
        try {
            // eslint-disable-next-line no-eval
            this.result_value = eval(this.formula);
        } catch (e) {
            this.result_value = NaN;
        }
    }
}