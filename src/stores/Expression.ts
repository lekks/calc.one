export type Result = string;
export type Operation = string;
export type Formula = string;

export interface Expression {
    getResult(): Result;
    getFormula(): Formula;
}

export class NumberExpression implements Expression{
    private readonly formula: Formula;
    private readonly result_value: number;

    constructor(formula: string) {
        this.formula = formula;
        this.result_value = parseFloat(this.formula);
    }

    getResult(): Result {
        return isNaN(this.result_value) ? "?" : String(this.result_value);
    }

    getFormula(): Formula {
        return this.formula
    }
}


export class AriphmeticExpression implements Expression {

    private readonly formula: Formula;
    private readonly result_value: number;

    constructor(oper:Operation, left: Expression, right: Expression) {
        this.formula = `${left.getFormula()} ${oper} ${right.getFormula()}`;
        this.result_value = AriphmeticExpression.evaluate(this.formula);

    }

    getResult(): Result {
        return isNaN(this.result_value) ? "?" : String(this.result_value);
    }

    getFormula(): Formula {
        return this.formula;
    }

    private static evaluate(formula: Formula) :number {
        try {
            // eslint-disable-next-line no-eval
            return  eval(formula);
        } catch (e) {
            return  NaN;
        }
    }
}