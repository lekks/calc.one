import ops from "../stores/operations";
import {Expression, NumberExpression} from "../stores/Expression";

function buildTestExpr4(a: number | string, op1: string, b: number | string, op3: string, c: number | string, op2: string, d: number | string): Expression {
    let [expA, expB, expC, expD] = [a, b, c, d].map((n) => {
        return new NumberExpression(n)
    });
    const left = ops.buildExpression(op1, expA, expB);
    const right = ops.buildExpression(op2, expC, expD);
    return ops.buildExpression(op3, left, right)
}

function buildFuncTestExpr3(a: number | string, op1: string, b: number | string, op2: string, c: number | string): Expression {
    let [expA, expB, expC] = [a, b, c].map((n) => {
        return new NumberExpression(n)
    });
    const left = ops.buildExpression(op1, expA, expB);
    return ops.buildExpression(op2, left, expC)
}

describe("Expressions composition test", () => {

    test.each([
        [1, "+", 2, "+", 3, "+", 4, "1+2+3+4"],
        [1, "*", 2, "+", 3, "-", 4, "1\\times2+3-4"],
        [1, "/", 2, "+", 3, "*", 4, "\\frac{1}{2}+3\\times4"],
        [1, "-", 2, "+", 3, "/", 4, "1-2+\\frac{3}{4}"],
        [1, "-", 2, "-", 3, "-", 4, "1-2-\\left(3-4\\right)"],
        [1, "-", 2, "-", 3, "+", 4, "1-2-\\left(3+4\\right)"],
        [1, "*", 2, "-", 3, "*", 4, "1\\times2-3\\times4"],
        [1, "*", 2, "-", 3, "/", 4, "1\\times2-\\frac{3}{4}"],
        [1, "+", 2, "*", 3, "+", 4, "\\left(1+2\\right)\\times\\left(3+4\\right)"],
        [1, "/", 2, "*", 3, "-", 4, "\\frac{1}{2}\\times\\left(3-4\\right)"],
        [1, "+", 2, "*", 3, "*", 4, "\\left(1+2\\right)\\times3\\times4"],
        [1, "+", 2, "*", 3, "/", 4, "\\left(1+2\\right)\\times\\frac{3}{4}"],
        [1, "+", 2, "/", 3, "/", 4, "\\frac{1+2}{\\frac{3}{4}}"],
        [1, "*", 2, "/", 3, "*", 4, "\\frac{1\\times2}{3\\times4}"],
        [1, "/", 2, "/", 3, "+", 4, "\\frac{\\frac{1}{2}}{3+4}"],
        [1, "+", 2, "/", 3, "-", 4, "\\frac{1+2}{3-4}"],
        [1, "/", 2, "/", 3, "/", 4, "\\frac{\\frac{1}{2}}{\\frac{3}{4}}"],
    ])('test arithmetic tex generation', (a, op1, b, op3, c, op2, d, expected) => {
        const expr = buildTestExpr4(a, op1 as string, b, op3 as string, c, op2 as string, d);
        expect(expr.getTex()).toBe(expected)
    });

    //FIXME functions has 1 argument, not 2!!!!
    test.each([
        [1, "+", 2, "sqrt", 3, "\\sqrt{1+2}"],
        [1, "/", 2, "sqrt", 3, "\\sqrt{\\frac{1}{2}}"],
        [1, "+", 2, "sqr", 3, "\\left(1+2\\right)^{2}"],
        [1, "/", 2, "sqr", 3, "\\left(\\frac{1}{2}\\right)^{2}"],
        [1, "sqr", 3, "-", 4, "1^{2}-4"],

    ])('test function tex generation', (a, op1, b, op2, c, expected) => {
        const expr = buildFuncTestExpr3(a, op1 as string, b, op2 as string, c);
        expect(expr.getTex()).toBe(expected)
    });


    test.each([
        [1, "+", 2, "+", 3, "+", 4, 10],
        [1, "*", 2, "+", 3, "-", 4, 1],
        [1, "/", 2, "+", 3, "*", 4, 12.5],
        [1, "-", 2, "+", 8, "/", 4, 1],
        [1, "-", 2, "-", 3, "-", 4, 0],
        [1, "-", 2, "-", 3, "+", 4, -8],
        [1, "*", 2, "-", 3, "*", 4, -10],
        [1, "*", 2, "-", 2, "/", 4, 1.5],
        [1, "+", 2, "*", 3, "+", 4, 21],
        [1, "/", 2, "*", 3, "-", 4, -0.5],
        [1, "+", 2, "*", 3, "*", 4, 36],
        [1, "+", 2, "*", 3, "/", 6, 1.5],
        [1, "+", 2, "/", 12, "/", 4, 1],
        [1.5, "*", 2, "/", 3, "*", 4, 0.25],
        [7, "/", 2, "/", 3, "+", 4, 0.5],
        [1, "+", 2, "/", 3, "-", 4, -3],
        [1, "+", 2, "/", 3, "-", 4, -3],
    ])('test calculation', (a, op1, b, op3, c, op2, d, expected) => {
        const expr = buildTestExpr4(a, op1 as string, b, op3 as string, c, op2 as string, d);
        expect(expr.getResult()).toBe(expected)
    })


});