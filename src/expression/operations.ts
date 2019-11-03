import {ArithmeticExpression, Expression, FunctionExpression, invertExpresson, OperationRank,} from "./Expression";


interface OptParam {
    operandsNumber: number,

    build(...operands: Expression[]): Expression,
}

const operationsTable: { [opt: string]: OptParam } = {
    "+": {
        operandsNumber: 2,
        build: function (a: Expression, b: Expression) {
            return new ArithmeticExpression((a, b) => `${a}+${b}`, (a, b) => a + b, OperationRank.PLUS_MINUS, true, true, a, b)
        },
    },
    "-": {
        operandsNumber: 2,
        build: function (a: Expression, b: Expression) {
            return new ArithmeticExpression((a, b) => `${a}-${b}`, (a, b) => a - b, OperationRank.PLUS_MINUS, false, true, a, b)
        },
    },
    "*": {
        operandsNumber: 2,
        build: function (a: Expression, b: Expression) {
            return new ArithmeticExpression((a, b) => `${a}\\times${b}`, (a, b) => a * b, OperationRank.MULT__DIV, true, true, a, b)
        },
    },
    "/": {
        operandsNumber: 2,
        build: function (a: Expression, b: Expression) {
            return new ArithmeticExpression((a, b, leftExpr, rightExpr) => `\\frac{${leftExpr.getTex()}}{${rightExpr.getTex()}}`, (a, b) => a / b, OperationRank.MULT__DIV, false, true, a, b)
        },
    },
    "sqrt": {
        operandsNumber: 1,
        build: function (x: Expression) {
            return new FunctionExpression((x) => Math.sqrt(x), (a, x) => `\\sqrt{${x.getTex()}}`, x)
        },
    },
    "sqr": {
        operandsNumber: 1,
        build: function (x: Expression) {
            return new FunctionExpression((x) => x * x, (x) => `{${x}}^2`, x)
        },
    },
    "uminus": {
        operandsNumber: 1,
        build: function (x: Expression) {
            return invertExpresson(x)
        },

    }
};

export default {
    buildExpression(operation: string, ...operands: Expression[]): Expression {
        return operationsTable[operation].build(...operands)
    },

    operandsNumber(operation: string): number {
        return operationsTable[operation].operandsNumber;
    },

    defined(operation: string): boolean {
        return operation in operationsTable;
    }
}

