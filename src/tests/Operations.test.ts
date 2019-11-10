import ops from "../expression/operations";
import {Expression, NumberExpression} from "../expression/Expression";

function buildTestExpr4(a: number | string, op1: string, b: number | string, op3: string, c: number | string, op2: string, d: number | string): Expression {
    let [expA, expB, expC, expD] = [a, b, c, d].map((n) => {
        return new NumberExpression(n)
    });
    const left = ops.buildExpression(op1, expA, expB);
    const right = ops.buildExpression(op2, expC, expD);
    return ops.buildExpression(op3, left, right)
}

function buildFuncTestExpr1(func: string, a: number | string, op1: string, b: number | string): Expression {
    const arg = ops.buildExpression(op1, new NumberExpression(a), new NumberExpression(b));
    return ops.buildExpression(func, arg)
}

function buildFuncFuncTest(func2: string, func1: string, a: number | string): Expression {
    return ops.buildExpression(func2, ops.buildExpression(func1, new NumberExpression(a)))
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

    test.each([
        ["sqrt", 1, "+", 2, "\\sqrt{1+2}"],
        ["sqrt", 1, "/", 2, "\\sqrt{\\frac{1}{2}}"],
        ["sqr", 1, "+", 2, "{\\left(1+2\\right)}^2"],
        ["sqr", 1, "/", 2, "{\\left(\\frac{1}{2}\\right)}^2"],
        ["sqr", 1, "*", 2, "{\\left(1\\times2\\right)}^2"],
        ["uminus", 1, "*", 2, "{-\\left(1\\times2\\right)}"],
        ["uminus", 1, "/", 2, "{-\\left(\\frac{1}{2}\\right)}"],
        ["uminus", 1, "+", 2, "{-\\left(1+2\\right)}"],
        ["uminus", 1, "-", 2, "{-\\left(1-2\\right)}"],

    ])('test function of operator tex generation', (func, a, op1, b, expected) => {
        const expr = buildFuncTestExpr1(func as string, a, op1 as string, b);
        expect(expr.getTex()).toBe(expected)
    });

    test.each([
        ["sqr", "sqr", 1, "{{1}^2}^2"],
        ["sqr", "sqrt", 3, "{\\sqrt{3}}^2"],
        ["sqrt", "sqr", 5, "\\sqrt{{5}^2}"],

    ])('test function of operator tex generation', (func2, func1, a, expected) => {
        const expr = buildFuncFuncTest(func2 as string, func1 as string, a);
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