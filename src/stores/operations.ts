import {AriphmeticExpression, Expression} from "./Expression";

export enum OperationRank {
    PLUS_MINUS,
    MULT__DIV,
    FUNC,
    UNARY,
    NUMBER
}

interface OptParam {
    operandsNumber:number,
    rank: OperationRank,
    associative?: boolean
}

export const operations:{[opt:string]:OptParam} = {
    "+": {
        operandsNumber: 2,
        rank: OperationRank.PLUS_MINUS,
        associative: true,
    },
    "-": {
        operandsNumber: 2,
        rank: OperationRank.PLUS_MINUS,
    },
    "*": {
        operandsNumber: 2,
        rank: OperationRank.MULT__DIV,
        associative: true,
    },
    "/": {
        operandsNumber: 2,
        rank: OperationRank.MULT__DIV,
    }
};

export default {
    buildExpression(operation: string, ...operands: Expression[]): Expression {
        const {rank, associative} = operations[operation];
        return new AriphmeticExpression(rank, associative, operation, ...operands)
    },

    operandsNumber(operation: string): number {
        return operations[operation].operandsNumber;
    },

    defined(operation: string): boolean {
        return operation in operations;
    }
}

