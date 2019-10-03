export enum OperationRank {
    PLUS_MINUS,
    MULT__DIV,
    FUNC,
    UNARY,
    NUMBER
}

export type Result = number;
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
        return this.result_value;
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

type ArithmeticTexBuilder = (leftStr: string, rightStr: string, leftExpr: Expression, rightExpr: Expression) => string;

export class ArithmeticExpression implements Expression {
    private readonly formula: string;
    private readonly tex_formula: string;
    private readonly result_value: number;
    private readonly explicitTexPareses: boolean;

    constructor(tex: ArithmeticTexBuilder,
                calc: (...args: Result[]) => Result,
                private readonly rank: OperationRank,
                private readonly associative: boolean,
                explicitTexPareses: boolean,
                symbol: string,
                private readonly left: Expression,
                private readonly right: Expression) {
        this.explicitTexPareses = explicitTexPareses;
        this.formula = this.buildFormula(symbol);
        this.tex_formula = this.buildTex(tex);
        this.result_value = calc(left.getResult(), right.getResult());
    }

    getResult(): Result {
        return this.result_value;
    }

    private buildFormula(symbol: string): string {
        const leftStr = ArithmeticExpression.buildOperandFormulaStr(this.left, this.needLeftParenthesis());
        const rightStr = ArithmeticExpression.buildOperandFormulaStr(this.right, this.needRightParenthesis());
        return `${leftStr} ${symbol} ${rightStr}`
    }

    private needLeftParenthesis(): boolean {
        return this.rank > this.left.getRank()
    }

    static buildOperandFormulaStr(expr: Expression, toEmbrace: boolean): string {
        return toEmbrace ? `(${expr.getFormula()})` : `${expr.getFormula()}`;
    }

    static buildOperandTexStr(expr: Expression, toEmbrace: boolean): string {
        return toEmbrace ? `\\left(${expr.getTex()}\\right)` : `${expr.getTex()}`;
    }

    private needRightParenthesis(): boolean {
        return this.rank > this.right.getRank() || (!this.associative && this.rank === this.right.getRank())
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

    private buildTex(builder: ArithmeticTexBuilder): string {
        const leftStr = ArithmeticExpression.buildOperandTexStr(this.left, this.needLeftParenthesis() && this.left.useExplicitTexPareses());
        const rightStr = ArithmeticExpression.buildOperandTexStr(this.right, this.needRightParenthesis() && this.right.useExplicitTexPareses());
        return builder(leftStr, rightStr, this.left, this.right);
    }
}

export class FunctionExpression implements Expression {

    private readonly formula: string;
    private readonly tex_formula: string;
    private readonly result_value: number;

    constructor(
            calc: (arg: Result) => Result,
            buildTex: (arg: string) => string,
            buildFormula: (arg: string) => string,
            private readonly arg: Expression) {
        this.formula = buildFormula(arg.getTex());
        this.tex_formula = buildTex(arg.getTex());
        this.result_value = calc(arg.getResult());
    }

    getFormula(): string {
        return this.formula;
    }

    getRank(): OperationRank {
        return OperationRank.FUNC;
    }

    getTex(): string {
        return this.tex_formula;
    }

    useExplicitTexPareses(): boolean {
        return false;
    }

    getResult(): number {
        return this.result_value;
    }

}
