import {OperationRank} from "./operations";

export type Result = string;
export type Operation = string;
export type Formula = string;

export interface Expression {
    getResult(): Result;

    getFormula(): Formula;

    getRank(): OperationRank
}

export class NumberExpression implements Expression {
    private readonly formula: Formula;
    private readonly result_value: number;

    constructor(value: string | number) {
        if (typeof value === 'number') {
            this.formula = value.toString();
            this.result_value = value;
        } else {
            this.result_value = parseFloat(value);
            this.formula = value;
        }
    }

    getResult(): Result {
        return isNaN(this.result_value) ? "?" : String(this.result_value);
    }

    getFormula(): Formula {
        return this.formula
    }

    getRank(): number {
        return OperationRank.NUMBER
    }

}

export class AriphmeticExpression implements Expression {

    private readonly formula: Formula;
    private readonly result_value: number;
    private readonly rank: OperationRank;
    private readonly associative: boolean;

    constructor(rank: OperationRank, associative: boolean | undefined, oper: Operation, ...operands: Expression[]) {
        this.rank = rank;
        this.associative = !!associative;
        this.formula = this.buildFormula(oper, operands[0], operands[1]);
        this.result_value = AriphmeticExpression.evaluate(this.formula);
    }

    static buildOperandFormulaStr(expr: Expression, toEmbrace: boolean) {
        return toEmbrace ? `(${expr.getFormula()})` : `${expr.getFormula()}`;
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

    getRank(): OperationRank {
        return this.rank;
    }

    private buildFormula(oper: Operation, left: Expression, right: Expression): Formula {
        const leftStr = AriphmeticExpression.buildOperandFormulaStr(left, this.needLeftParenthesis(left));
        const rightStr = AriphmeticExpression.buildOperandFormulaStr(right, this.needRightParenthesis(right));

        return `${leftStr} ${oper} ${rightStr}`
    }

    private needLeftParenthesis(expr: Expression): boolean {
        return this.getRank() > expr.getRank()
    }

    private needRightParenthesis(expr: Expression): boolean {
        return this.getRank() > expr.getRank() || (!this.associative && this.getRank() === expr.getRank())
    }

}

