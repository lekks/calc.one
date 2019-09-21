import {OperationRank} from "./operations";

export type Result = string;
export type Operation = string;
export type Formula = string;

export interface Expression {
    getResult(): Result;
    getFormula(): Formula;
    getRank():OperationRank
}

export class NumberExpression implements Expression {
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

    getRank():number {
        return OperationRank.NUMBER
    }

}

export class AriphmeticExpression implements Expression {

    private readonly formula: Formula;
    private readonly result_value: number;
    private readonly rank: OperationRank;

    constructor(rank: OperationRank, oper: Operation, ...operands:Expression[]) {
        this.rank = rank;
        this.formula = this.buildFormula(oper,operands[0],operands[1]);
        this.result_value = AriphmeticExpression.evaluate(this.formula);

    }

    private buildFormula(oper: Operation, left: Expression, right: Expression):Formula {
        const leftStr = this.buildFormulaStr(left);
        const rightStr = this.buildFormulaStr(right);

        return `${leftStr} ${oper} ${rightStr}`
    }

    buildFormulaStr(expr: Expression) {
            return this.getRank() > expr.getRank() ? `(${expr.getFormula()})` : `${expr.getFormula()}`;
    }

    private static evaluate(formula: Formula): number {
        try {
            // eslint-disable-next-line no-eval
            return eval(formula);
        } catch (e) {
            return NaN;
        }
    }

    getResult(): Result {
        return isNaN(this.result_value) ? "?" : String(this.result_value);
    }

    getFormula(): Formula {
        return this.formula;
    }

    getRank():OperationRank {
        return this.rank;
    }

}

