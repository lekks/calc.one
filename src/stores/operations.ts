import {AriphmeticExpression, Expression, OperationRank, TexBuilder} from "./Expression";


interface OptParam {
    operandsNumber:number,
    rank: OperationRank,
    associative?: boolean
    explicitTexPareses?: boolean
    tex: TexBuilder,
}

export const operations:{[opt:string]:OptParam} = {
    "+": {
        operandsNumber: 2,
        rank: OperationRank.PLUS_MINUS,
        associative: true,
        explicitTexPareses: true,
        tex: (a, b) => {
            return `${a}+${b}`
        },
    },
    "-": {
        operandsNumber: 2,
        rank: OperationRank.PLUS_MINUS,
        explicitTexPareses: true,
        tex: (a, b) => {
            return `${a}-${b}`
        },
    },
    "*": {
        operandsNumber: 2,
        rank: OperationRank.MULT__DIV,
        associative: true,
        explicitTexPareses: true,
        tex: (a, b) => {
            return `${a}\\times${b}`
        },
    },
    "/": {
        operandsNumber: 2,
        explicitTexPareses: false,
        rank: OperationRank.MULT__DIV,
        tex: (a, b) => {
            return `\\frac{${a}}{${b}}`
        },
    }
};

export default {
    buildExpression(operation: string, ...operands: Expression[]): Expression {
        const {rank, associative, explicitTexPareses, tex} = operations[operation];
        return new AriphmeticExpression(tex, rank, associative, explicitTexPareses, operation, ...operands)
    },

    operandsNumber(operation: string): number {
        return operations[operation].operandsNumber;
    },

    defined(operation: string): boolean {
        return operation in operations;
    }
}

