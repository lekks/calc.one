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

        expect(calculator.stackResult.getValue()).toBe(6)
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

        expect(calculator.stackResult.getValue()).toBe(8)
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

        expect(calculator.stackResult.getValue()).toBe(12)
    });

})