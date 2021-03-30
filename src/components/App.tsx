import React from 'react';
import CalcButton from './CalcButton';
import ExpressionStack from "./ExpressionStack";
import InputPanel from "./InputPanel";
import './App.css';
import {CalcInputEvent, CalcInputType, Calculator, StackItem} from "../calculator/Calculator";
import {BehaviorSubject, Subject} from "rxjs";

const CLIPBOARD_ROUND = 8;

const calcInputEvent = new Subject<CalcInputEvent>();
const calcEditorStringInput = new Subject<string>();
const calcEditorStringOutput = new Subject<string>();
const calcResult = new BehaviorSubject<number>(NaN);
const calcExpressionStack = new Subject<StackItem[]>()

new Calculator({
    inputEvent: calcInputEvent,
    editorTextInput: calcEditorStringInput,
    result: calcResult,
    editorText: calcEditorStringOutput,
    expressionStack: calcExpressionStack
});

const App: React.FC = () => {
    return (
        <div className="App">
            <ExpressionStack subject={calcExpressionStack}/>
            <InputPanel subject={calcEditorStringOutput}/>
            <div className="Pad">
                <table className="Buttons">
                    <tbody>
                    {/*<tr>*/}
                    {/*    <td/><td/><td/><td/>*/}
                    {/*    <td>*/}
                    {/*        <div className={"Button"} onClick={(event: any) => { console.log("PASTE") }}>*/}
                    {/*            Paste*/}
                    {/*        </div>*/}
                    {/*    </td>*/}
                    {/*</tr>*/}
                    <tr>
                        <td className="Num"><CalcButton caption="7" tag="7" keybind="7"
                                                        action={CalcInputType.ADD_NUMBER}
                                                        subject={calcInputEvent}/>
                        </td>
                        <td className="Num"><CalcButton caption="8" tag="8" keybind="8"
                                                        action={CalcInputType.ADD_NUMBER}
                                                        subject={calcInputEvent}/>
                        </td>
                        <td className="Num"><CalcButton caption="9" tag="9" keybind="9"
                                                        action={CalcInputType.ADD_NUMBER}
                                                        subject={calcInputEvent}/>
                        </td>
                        <td><CalcButton caption="/" tag="/" keybind="/" action={CalcInputType.OPERATION}
                                        subject={calcInputEvent}/></td>
                        <td><CalcButton caption="<-" keybind="Backspace" action={CalcInputType.BS}
                                        subject={calcInputEvent}/></td>
                    </tr>
                    <tr>
                        <td className="Num"><CalcButton caption="4" tag="4" keybind="4"
                                                        action={CalcInputType.ADD_NUMBER}
                                                        subject={calcInputEvent}/>
                        </td>
                        <td className="Num"><CalcButton caption="5" tag="5" keybind="5"
                                                        action={CalcInputType.ADD_NUMBER}
                                                        subject={calcInputEvent}/>
                        </td>
                        <td className="Num"><CalcButton caption="6" tag="6" keybind="6"
                                                        action={CalcInputType.ADD_NUMBER}
                                                        subject={calcInputEvent}/>
                        </td>
                        <td><CalcButton caption="*" tag="*" keybind="*" action={CalcInputType.OPERATION}
                                        subject={calcInputEvent}/></td>
                        <td><CalcButton caption="Del" tag="clear" keybind="Delete" action={CalcInputType.DEL}
                                        subject={calcInputEvent}/></td>
                    </tr>
                    <tr>
                        <td className="Num"><CalcButton caption="1" tag="1" keybind="1"
                                                        action={CalcInputType.ADD_NUMBER}
                                                        subject={calcInputEvent}/>
                        </td>
                        <td className="Num"><CalcButton caption="2" tag="2" keybind="2"
                                                        action={CalcInputType.ADD_NUMBER}
                                                        subject={calcInputEvent}/>
                        </td>
                        <td className="Num"><CalcButton caption="3" tag="3" keybind="3"
                                                        action={CalcInputType.ADD_NUMBER}
                                                        subject={calcInputEvent}/>
                        </td>
                        <td><CalcButton caption="-" tag="-" keybind="-" action={CalcInputType.OPERATION}
                                        subject={calcInputEvent}/></td>
                        <td><CalcButton caption="Swap" keybind="PageDown" action={CalcInputType.SWAP}
                                        subject={calcInputEvent}/></td>
                    </tr>
                    <tr>
                        <td className="Num"><CalcButton caption="0" tag="0" keybind="0"
                                                        action={CalcInputType.ADD_NUMBER}
                                                        subject={calcInputEvent}/>
                        </td>
                        <td className="Num"><CalcButton caption="." tag="." keybind="."
                                                        action={CalcInputType.ADD_NUMBER}
                                                        subject={calcInputEvent}/>
                        </td>
                        <td/>
                        <td><CalcButton caption="+" tag="+" keybind="+" action={CalcInputType.OPERATION}
                                        subject={calcInputEvent}/></td>
                        <td><CalcButton caption="Reset" keybind="Escape" action={CalcInputType.CLEAR}
                                        subject={calcInputEvent}/></td>
                    </tr>
                    <tr>
                        <td><CalcButton caption="√" tag="sqrt" keybind="\" action={CalcInputType.OPERATION}
                                        subject={calcInputEvent}/></td>
                        <td><CalcButton caption="x²" tag="sqr" action={CalcInputType.OPERATION}
                                        subject={calcInputEvent}/></td>
                        <td><CalcButton caption="-x" tag="uminus" action={CalcInputType.OPERATION}
                                        subject={calcInputEvent}/></td>
                        <td/>
                        <td><CalcButton caption="Enter" keybind="Enter" action={CalcInputType.ENTER}
                                        subject={calcInputEvent}/></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export function registerClipboardSupport() {

    function toSeasonableString(x: number): string {
        return String(Number(x.toFixed(CLIPBOARD_ROUND)))
    }

    window.document.addEventListener('paste', (e) => {
        if (e.clipboardData) {
            const string = e.clipboardData.getData('text/plain');
            calcEditorStringInput.next(string)
        }
        e.preventDefault();
    });

    window.document.addEventListener('copy', (e) => {
        const result = calcResult.getValue();
        if (!isNaN(result)) {
            e.clipboardData && e.clipboardData.setData('text/plain', toSeasonableString(result));
        }
        e.preventDefault();
    });
}


export default App;
