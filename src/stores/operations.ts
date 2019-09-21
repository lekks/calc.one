
export enum OperationRank {
    PLUS,
    MINUS,
    MULT_DIV,
    FUNC,
    NUMBER
}

interface OptParam {
    operandsNumber:number,
    rank: OperationRank,
}

export const operations:{[opt:string]:OptParam} = {
    "+": {
        operandsNumber: 2,
        rank: OperationRank.PLUS,
        // calc: (a: number, b: number) => {
        //     return a + b
        // }
    },
    "-": {
        operandsNumber: 2,
        rank: OperationRank.MINUS,
    },
    "*": {
        operandsNumber: 2,
        rank: OperationRank.MULT_DIV,
    },
    "/": {
        operandsNumber: 2,
        rank: OperationRank.MULT_DIV,
    }
};