export enum OperationRank {
    PLUS_MINUS,
    MULT__DIV,
    FUNC,
    NUMBER
}

export type Result = number;
export interface Expression {
    getResult(): Result;
    getRank(): OperationRank;
    getTex(): string;

    useExplicitTexParentheses(): boolean;
}

export class NumberExpression implements Expression {
    private readonly tex: string;
    private readonly result_value: number;

    constructor(value: string | number) {
        if (typeof value === 'number') {
            this.tex = value.toString();
            this.result_value = value;
        } else {
            this.result_value = parseFloat(value);
            this.tex = value;
        }
    }

    getResult(): Result {
        return this.result_value;
    }

    getRank(): number {
        return OperationRank.NUMBER
    }

    getTex(): string {
        return this.tex;
    }

    useExplicitTexParentheses(): boolean {
        return false;
    }

}

type ArithmeticTexBuilder = (leftStr: string, rightStr: string, leftExpr: Expression, rightExpr: Expression) => string;

function buildOperandTexStr(expr: Expression, toEmbrace: boolean): string {
    return toEmbrace ? `\\left(${expr.getTex()}\\right)` : `${expr.getTex()}`;
}

export class ArithmeticExpression implements Expression {
    private readonly tex_formula: string;
    private readonly result_value: number;
    private readonly explicitTexParentheses: boolean;

    constructor(tex: ArithmeticTexBuilder,
                calc: (...args: Result[]) => Result,
                private readonly rank: OperationRank,
                private readonly associative: boolean,
                explicitTexParentheses: boolean,
                private readonly left: Expression,
                private readonly right: Expression) {
        this.explicitTexParentheses = explicitTexParentheses;
        this.tex_formula = this.buildTex(tex);
        this.result_value = calc(left.getResult(), right.getResult());
    }

    getResult(): Result {
        return this.result_value;
    }

    private needLeftParenthesis(): boolean {
        return this.rank > this.left.getRank()
    }

    private needRightParenthesis(): boolean {
        return this.rank > this.right.getRank() || (!this.associative && this.rank === this.right.getRank())
    }

    getRank(): OperationRank {
        return this.rank;
    }

    getTex(): string {
        return this.tex_formula;
    }

    useExplicitTexParentheses(): boolean {
        return this.explicitTexParentheses;
    }

    private buildTex(builder: ArithmeticTexBuilder): string {
        const leftStr = buildOperandTexStr(this.left, this.needLeftParenthesis() && this.left.useExplicitTexParentheses());
        const rightStr = buildOperandTexStr(this.right, this.needRightParenthesis() && this.right.useExplicitTexParentheses());
        return builder(leftStr, rightStr, this.left, this.right);
    }
}

export class FunctionExpression implements Expression {

    private readonly tex_formula: string;
    private readonly result_value: number;

    constructor(
        calc: (arg: Result) => Result,
        buildTex: (arg: string, expr: Expression) => string,
        private readonly arg: Expression) {
        this.tex_formula = buildTex(buildOperandTexStr(arg, arg.useExplicitTexParentheses()), arg);
        this.result_value = calc(arg.getResult());
    }

    getRank(): OperationRank {
        return OperationRank.FUNC;
    }

    getTex(): string {
        return this.tex_formula;
    }

    useExplicitTexParentheses(): boolean {
        return false;
    }

    getResult(): number {
        return this.result_value;
    }

}


class UnaryMinusExpression implements Expression {

    private readonly tex_formula: string;
    private readonly result_value: number;

    constructor(
        private readonly arg: Expression) {
        this.tex_formula = `{-${arg.getTex()}}`;
        this.result_value = -arg.getResult();
    }

    getRank(): OperationRank {
        return OperationRank.FUNC;
    }

    getTex(): string {
        return this.tex_formula;
    }

    useExplicitTexParentheses(): boolean {
        return true;
    }

    getResult(): number {
        return this.result_value;
    }

    getArg(): Expression {
        return this.arg;
    }

}

export function invertExpresson(arg: Expression) {
    if (arg instanceof UnaryMinusExpression)
        return arg.getArg();
    else
        return new UnaryMinusExpression(arg);
}