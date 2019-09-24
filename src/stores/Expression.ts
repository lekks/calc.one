export enum OperationRank {
    PLUS_MINUS,
    MULT__DIV,
    FUNC,
    UNARY,
    NUMBER
}

export type Result = string;
export type Operation = string;
export type TexBuilder = (...args: string[]) => string;

export interface Expression {
    getResult(): Result;

    getFormula(): string;

    getRank(): OperationRank;

    getTex(): string;

    useExplicitTexPareses(): boolean;
}

export class NumberExpression implements Expression {
    private readonly formula: string;
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

    getFormula(): string {
        return this.formula
    }

    getRank(): number {
        return OperationRank.NUMBER
    }

    getTex(): string {
        return this.formula;
    }

    useExplicitTexPareses(): boolean {
        return false;
    }

}

export class AriphmeticExpression implements Expression {

    private readonly formula: string;
    private readonly tex_formula: string;
    private readonly result_value: number;
    private readonly rank: OperationRank;
    private readonly associative: boolean;
    private readonly explicitTexPareses: boolean;

    constructor(tex: TexBuilder, rank: OperationRank, associative: boolean | undefined, explicitTexPareses: boolean | undefined, oper: Operation, ...operands: Expression[]) {
        this.rank = rank;
        this.associative = !!associative;
        this.explicitTexPareses = !!explicitTexPareses;
        this.formula = this.buildFormula(oper, operands[0], operands[1]);
        this.tex_formula = this.buildTex(tex, operands[0], operands[1]);
        this.result_value = AriphmeticExpression.evaluate(this.formula);
    }

    static buildOperandFormulaStr(expr: Expression, toEmbrace: boolean): string {
        return toEmbrace ? `(${expr.getFormula()})` : `${expr.getFormula()}`;
    }

    static buildOperandTexStr(expr: Expression, toEmbrace: boolean): string {
        return toEmbrace ? `(${expr.getTex()})` : `${expr.getTex()}`;
    }

    private static evaluate(formula: string): number {
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

    getFormula(): string {
        return this.formula;
    }

    getRank(): OperationRank {
        return this.rank;
    }

    getTex(): string {
        return this.tex_formula;
    }

    useExplicitTexPareses(): boolean {
        return this.explicitTexPareses;
    }

    private buildFormula(oper: Operation, left: Expression, right: Expression): string {
        const leftStr = AriphmeticExpression.buildOperandFormulaStr(left, this.needLeftParenthesis(left));
        const rightStr = AriphmeticExpression.buildOperandFormulaStr(right, this.needRightParenthesis(right));

        return `${leftStr} ${oper} ${rightStr}`
    }

    private buildTex(builder: TexBuilder, left: Expression, right: Expression): string {
        const leftStr = AriphmeticExpression.buildOperandTexStr(left, this.needLeftParenthesis(left) && left.useExplicitTexPareses());
        const rightStr = AriphmeticExpression.buildOperandTexStr(right, this.needRightParenthesis(right) && right.useExplicitTexPareses());

        return builder(leftStr, rightStr);
    }

    private needLeftParenthesis(expr: Expression): boolean {
        return this.getRank() > expr.getRank()
    }

    private needRightParenthesis(expr: Expression): boolean {
        return this.getRank() > expr.getRank() || (!this.associative && this.getRank() === expr.getRank())
    }

}

