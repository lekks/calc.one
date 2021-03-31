import {BS_SYMBOL, CLEAR_SYMBOL, Editor} from "../calculator/Editor";
import {BehaviorSubject, from, Subject} from "rxjs";


describe('Test Editor', () => {
    let editorText: BehaviorSubject<string>
    let editorSymbolInput: Subject<string>
    let editorStringInput: Subject<string>
    let editor: Editor

    beforeEach(() => {
        editorText = new BehaviorSubject<string>("")
        editorSymbolInput = new Subject<string>()
        editorStringInput = new Subject<string>()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        editor = new Editor({
            outputText: editorText,
            inputSymbols: editorSymbolInput,
            inputString: editorStringInput
        });
    });


    test('Editor add symbol', () => {
        const arraySource = from("124358.6");
        arraySource.subscribe(editorSymbolInput)
        expect(editorText.getValue()).toBe('124358.6')
    });

    test('Editor add string', () => {
        editorStringInput.next("453558.612")
        expect(editorText.getValue()).toBe('453558.612')
    });

    test('Editor reject symbol', () => {
        editorStringInput.next("213sd.7")
        expect(editorText.getValue()).toBe('213.7')
    });

    test('Editor reject second point', () => {
        editorStringInput.next("233.23.5")
        expect(editorText.getValue()).toBe('233.235')
    });

    test('Editor substitute comma', () => {
        editorStringInput.next("233,23,5")
        expect(editorText.getValue()).toBe('233.235')
    });

    test('Editor backspace', () => {
        editorStringInput.next("12345")
        expect(editorText.getValue()).toBe('12345')
        editorSymbolInput.next(BS_SYMBOL)
        expect(editorText.getValue()).toBe('1234')
    });

    test('Editor clear', () => {
        editorStringInput.next("12345")
        expect(editorText.getValue()).toBe('12345')
        editorSymbolInput.next(CLEAR_SYMBOL)
        expect(editorText.getValue()).toBe('')
    });


});
