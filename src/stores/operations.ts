import {AriphmeticExpression, DivideExpression, Expression, OperationRank} from "./Expression";


interface OptParam {
    operandsNumber:number,

    build(...operands: Expression[]): Expression,
}

export const operations:{[opt:string]:OptParam} = {
    "+": {
        operandsNumber: 2,
        build: function (a: Expression, b: Expression) {
            return new AriphmeticExpression((a, b) => {
                return `${a}+${b}`
            }, OperationRank.PLUS_MINUS, true, true, "+", a, b)
        },
    },
    "-": {
        operandsNumber: 2,
        build: function (a: Expression, b: Expression) {
            return new AriphmeticExpression((a, b) => {
                return `${a}-${b}`
            }, OperationRank.PLUS_MINUS, false, true, "-", a, b)
        },
    },
    "*": {
        operandsNumber: 2,
        build: function (a: Expression, b: Expression) {
            return new AriphmeticExpression((a, b) => {
                return `${a}\\times${b}`
            }, OperationRank.MULT__DIV, true, true, "*", a, b)
        },
    },
    "/": {
        operandsNumber: 2,
        build: function (a: Expression, b: Expression) {
            return new DivideExpression(a, b)
        },
    }
};

export default {
    buildExpression(operation: string, ...operands: Expression[]): Expression {
        return operations[operation].build(...operands)
    },

    operandsNumber(operation: string): number {
        return operations[operation].operandsNumber;
    },

    defined(operation: string): boolean {
        return operation in operations;
    }
}

