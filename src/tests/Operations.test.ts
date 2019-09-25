import ops from "../stores/operations";
import {Expression, NumberExpression} from "../stores/Expression";

function buildTestExpr(a: number | string, op1: string, b: number | string, op3: string, c: number | string, op2: string, d: number | string): Expression {
    let [expA, expB, expC, expD] = [a, b, c, d].map((n) => {
        return new NumberExpression(n)
    });
    const left = ops.buildExpression(op1, expA, expB);
    const right = ops.buildExpression(op2, expC, expD);
    return ops.buildExpression(op3, left, right)
}

describe("Operations parentheses test", () => {

    test.each([
        [1, "+", 2, "+", 3, "+", 4, "1 + 2 + 3 + 4"],
        [1, "*", 2, "+", 3, "-", 4, "1 * 2 + 3 - 4"],
        [1, "/", 2, "+", 3, "*", 4, "1 / 2 + 3 * 4"],
        [1, "-", 2, "+", 3, "/", 4, "1 - 2 + 3 / 4"],
        [1, "-", 2, "-", 3, "-", 4, "1 - 2 - (3 - 4)"],
        [1, "-", 2, "-", 3, "+", 4, "1 - 2 - (3 + 4)"],
        [1, "*", 2, "-", 3, "*", 4, "1 * 2 - 3 * 4"],
        [1, "*", 2, "-", 3, "/", 4, "1 * 2 - 3 / 4"],
        [1, "+", 2, "*", 3, "+", 4, "(1 + 2) * (3 + 4)"],
        [1, "/", 2, "*", 3, "-", 4, "1 / 2 * (3 - 4)"],
        [1, "+", 2, "*", 3, "*", 4, "(1 + 2) * 3 * 4"],
        [1, "+", 2, "*", 3, "/", 4, "(1 + 2) * 3 / 4"],
        [1, "+", 2, "/", 3, "/", 4, "(1 + 2) / (3 / 4)"],
        [1, "*", 2, "/", 3, "*", 4, "1 * 2 / (3 * 4)"],
        [1, "/", 2, "/", 3, "+", 4, "1 / 2 / (3 + 4)"],
        [1, "+", 2, "/", 3, "-", 4, "(1 + 2) / (3 - 4)"],
    ])('test proper parentheses skip', (a, op1, b, op3, c, op2, d, expected) => {
        const expr = buildTestExpr(a, String(op1), b, String(op3), c, String(op2), d);
        expect(expr.getFormula()).toBe(expected)
    })


});