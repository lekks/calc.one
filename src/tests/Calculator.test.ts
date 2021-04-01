import {BehaviorSubject, from, Subject} from "rxjs";
import {CalcInputEvent, CalcInputType, Calculator, StackItem} from "../calculator/Calculator";


describe('Test Calculator', () => {
    let calcInputEvent: Subject<CalcInputEvent>;
    let clipboardOutput: BehaviorSubject<number>;
    let stackResult: BehaviorSubject<StackItem | undefined>;
    let calculator: Calculator
    beforeEach(() => {
        calcInputEvent = new Subject<CalcInputEvent>();
        clipboardOutput = new BehaviorSubject<number>(NaN)
        stackResult = new BehaviorSubject<StackItem | undefined>(undefined);
        calculator = new Calculator({
            inputEvent: calcInputEvent,
            stackResult: stackResult,
            result: clipboardOutput
        });
    });

    afterEach(() => {
        calculator.destroy()
    })

    test('2х3=6', () => {
        from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.OPERATION, payload: '*'},
            ]
        ).subscribe(calcInputEvent);

        expect(stackResult.getValue()?.result).toBe(6)
        expect(clipboardOutput.getValue()).toBe(6)
    });

    test('op with editor', () => {
        from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.OPERATION, payload: '*'},
            ]
        ).subscribe(calcInputEvent);
        expect(stackResult.getValue()?.result).toBe(6)
        expect(clipboardOutput.getValue()).toBe(6)
    });

    test('factorial 5', () => {
        from([
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
        ).subscribe(calcInputEvent);
        expect(stackResult.getValue()?.result).toBe(120)
        expect(clipboardOutput.getValue()).toBe(120)
    });

    test('duplicate', () => {
        from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.OPERATION, payload: '*'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.OPERATION, payload: '+'},
            ]
        ).subscribe(calcInputEvent);
        expect(stackResult.getValue()?.result).toBe(12)
        expect(clipboardOutput.getValue()).toBe(12)
    });

    test('undo value', () => {
        from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ADD_NUMBER, payload: '5'},
                {type: CalcInputType.DEL},
                {type: CalcInputType.ADD_NUMBER, payload: '4'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.OPERATION, payload: '*'},
            ]
        ).subscribe(calcInputEvent);
        expect(stackResult.getValue()?.result).toBe(8)
        expect(clipboardOutput.getValue()).toBe(8)
    });

    test('swap', () => {
        from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.SWAP},
                {type: CalcInputType.OPERATION, payload: 'sqr'},
                {type: CalcInputType.OPERATION, payload: '*'},
            ]
        ).subscribe(calcInputEvent);
        expect(stackResult.getValue()?.result).toBe(12)
        expect(clipboardOutput.getValue()).toBe(12)
    });

    test('undo', () => {
        from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.OPERATION, payload: '+'},
                {type: CalcInputType.ADD_NUMBER, payload: '9'},
                {type: CalcInputType.BS},
                {type: CalcInputType.BS},
            ]
        ).subscribe(calcInputEvent);
        expect(stackResult.getValue()?.result).toBe(3)
        expect(clipboardOutput.getValue()).toBe(3)
    });

    test('del', () => {
        from([
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
        ).subscribe(calcInputEvent);
        expect(stackResult.getValue()?.result).toBe(2)
        expect(clipboardOutput.getValue()).toBe(2)
    });

    test('clear', () => {
        from([
                {type: CalcInputType.ADD_NUMBER, payload: '1'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '4'},
                {type: CalcInputType.CLEAR},
            ]
        ).subscribe(calcInputEvent);
        expect(stackResult.getValue()?.result).toBeUndefined()
        expect(clipboardOutput.getValue()).toBeNaN()
    });

    test('result is editor', () => {
        from([
                {type: CalcInputType.ADD_NUMBER, payload: '2'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.ADD_NUMBER, payload: '3'},
                {type: CalcInputType.ENTER},
                {type: CalcInputType.OPERATION, payload: '*'},
                {type: CalcInputType.ADD_NUMBER, payload: '1'},
                {type: CalcInputType.ADD_NUMBER, payload: '7'},
            ]
        ).subscribe(calcInputEvent);
        expect(stackResult.getValue()?.result).toBe(6)
        expect(clipboardOutput.getValue()).toBe(17)
    });


})