import {Editor} from "../calculator/Editor";
import {from} from "rxjs";


describe('Test Editor', () => {
    test('Editor add symbol', () => {
        let editor = new Editor();
        const arraySource = from("124358.6");
        arraySource.subscribe(editor.symbolInput)
        expect(editor.getInput()).toBe('124358.6')
    });

    test('Editor add string', () => {
        let editor = new Editor();
        editor.stringInput.next("453558.612")
        expect(editor.getInput()).toBe('453558.612')
    });

    test('Editor reject symbol', () => {
        let editor = new Editor();
        editor.stringInput.next("213sd.7")
        expect(editor.getInput()).toBe('213.7')
    });

    test('Editor reject second point', () => {
        let editor = new Editor();
        editor.stringInput.next("233.23.5")
        expect(editor.getInput()).toBe('233.235')
    });

    test('Editor substitute comma', () => {
        let editor = new Editor();
        editor.stringInput.next("233,23,5")
        expect(editor.getInput()).toBe('233.235')
    });

    test('Editor backspace', () => {
        let editor = new Editor();
        editor.stringInput.next("12345")
        expect(editor.getInput()).toBe('12345')
        editor.symbolInput.next(Editor.BS_SYMBOL)
        expect(editor.getInput()).toBe('1234')
    });

    test('Editor clear', () => {
        let editor = new Editor();
        editor.stringInput.next("12345")
        expect(editor.getInput()).toBe('12345')
        editor.symbolInput.next(Editor.CLEAR_SYMBOL)
        expect(editor.getInput()).toBe('')
    });


});
