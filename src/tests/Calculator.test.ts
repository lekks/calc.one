import {from} from "rxjs";
import {CalcInputType, Calculator} from "../calculator/Calculator";


describe('Test Calculator', () => {
    test('2х3=6', () => {
        const calculator = new Calculator()
        const arraySource = from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.OPERATION, payload: '*'},
            ]
        );
        arraySource.subscribe(calculator.calcInputEvent)

        expect(calculator.stackResult.getValue()?.result).toBe(6)
        expect(calculator.result.getValue()).toBe(6)
    });

    test('op with editor', () => {
        const calculator = new Calculator()
        const arraySource = from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.OPERATION, payload: '*'},
            ]
        );
        arraySource.subscribe(calculator.calcInputEvent)

        expect(calculator.stackResult.getValue()?.result).toBe(6)
        expect(calculator.result.getValue()).toBe(6)
    });

    test('factorial 5', () => {
        const calculator = new Calculator()
        const arraySource = from([
                {type: CalcInputType.ADD_NUMBER, payload: '1'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '4'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '5'},
                {type: CalcInputType.OPERATION, payload: '*'},
                {type: CalcInputType.OPERATION, payload: '*'},
                {type: CalcInputType.OPERATION, payload: '*'},
                {type: CalcInputType.OPERATION, payload: '*'},
            ]
        );
        arraySource.subscribe(calculator.calcInputEvent)

        expect(calculator.stackResult.getValue()?.result).toBe(120)
        expect(calculator.result.getValue()).toBe(120)
    });

    test('duplicate', () => {
        const calculator = new Calculator()
        const arraySource = from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.OPERATION, payload: '*'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.OPERATION, payload: '+'},
            ]
        );
        arraySource.subscribe(calculator.calcInputEvent)

        expect(calculator.stackResult.getValue()?.result).toBe(12)
        expect(calculator.result.getValue()).toBe(12)
    });

    test('undo value', () => {
        const calculator = new Calculator()
        const arraySource = from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ADD_NUMBER, payload: '5'},
                {type: CalcInputType.DEL},
                {type: CalcInputType.ADD_NUMBER, payload: '4'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.OPERATION, payload: '*'},
            ]
        );
        arraySource.subscribe(calculator.calcInputEvent)

        expect(calculator.stackResult.getValue()?.result).toBe(8)
        expect(calculator.result.getValue()).toBe(8)
    });

    test('swap', () => {
        const calculator = new Calculator()
        const arraySource = from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.SWAP},
                {type: CalcInputType.OPERATION, payload: 'sqr'},
                {type: CalcInputType.OPERATION, payload: '*'},
            ]
        );
        arraySource.subscribe(calculator.calcInputEvent)

        expect(calculator.stackResult.getValue()?.result).toBe(12)
        expect(calculator.result.getValue()).toBe(12)
    });

    test('undo', () => {
        const calculator = new Calculator()
        const arraySource = from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.OPERATION, payload: '+'},
                {type: CalcInputType.ADD_NUMBER, payload: '9'},
                {type: CalcInputType.BS},
                {type: CalcInputType.BS},
            ]
        );
        arraySource.subscribe(calculator.calcInputEvent)

        expect(calculator.stackResult.getValue()?.result).toBe(3)
        expect(calculator.result.getValue()).toBe(3)
    });

    test('del', () => {
        const calculator = new Calculator()
        const arraySource = from([
                {type: CalcInputType.ADD_NUMBER, payload: '1'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '4'},
                {type: CalcInputType.DEL},
                {type: CalcInputType.DEL},
            ]
        );
        arraySource.subscribe(calculator.calcInputEvent)

        expect(calculator.stackResult.getValue()?.result).toBe(2)
        expect(calculator.result.getValue()).toBe(2)
    });

    test('clear', () => {
        const calculator = new Calculator()
        const arraySource = from([
                {type: CalcInputType.ADD_NUMBER, payload: '1'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '4'},
                {type: CalcInputType.CLEAR},
            ]
        );
        arraySource.subscribe(calculator.calcInputEvent)

        expect(calculator.stackResult.getValue()?.result).toBeUndefined()
        expect(calculator.result.getValue()).toBeNaN()
    });

    test('result is editor', () => {
        const calculator = new Calculator()
        const arraySource = from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.OPERATION, payload: '*'},
                {type: CalcInputType.ADD_NUMBER, payload: '1'},
                {type: CalcInputType.ADD_NUMBER, payload: '7'},
            ]
        );
        arraySource.subscribe(calculator.calcInputEvent)

        expect(calculator.stackResult.getValue()?.result).toBe(6)
        expect(calculator.result.getValue()).toBe(17)
    });


})