import React from 'react';
import CalcButton from './CalcButton';
import ExpressionStack from "./ExpressionStack";
import InputPanel from "./InputPanel";
import Actions from "../dispatcher/Actions";
import './App.css';

const App: React.FC = () => {

    return (
        <div className="App">
            <ExpressionStack/>
            <InputPanel/>
            <table className="Buttons">
                <tbody>
                <tr>
                    <td><CalcButton caption="7" tag="7" keybind="7" action={Actions.ADD_NUMBER}/></td>
                    <td><CalcButton caption="8" tag="8" keybind="8" action={Actions.ADD_NUMBER}/></td>
                    <td><CalcButton caption="9" tag="9" keybind="9" action={Actions.ADD_NUMBER}/></td>
                    <td><CalcButton caption="/" tag="/" keybind="/" action={Actions.OPERATION}/></td>
                    <td><CalcButton caption="<-" keybind="Backspace" action={Actions.BS}/></td>
                </tr>
                <tr>
                    <td><CalcButton caption="4" tag="4" keybind="4" action={Actions.ADD_NUMBER}/></td>
                    <td><CalcButton caption="5" tag="5" keybind="5" action={Actions.ADD_NUMBER}/></td>
                    <td><CalcButton caption="6" tag="6" keybind="6" action={Actions.ADD_NUMBER}/></td>
                    <td><CalcButton caption="*" tag="*" keybind="*" action={Actions.OPERATION}/></td>
                    <td><CalcButton caption="Del" tag="clear" keybind="Delete" action={Actions.DEL}/></td>
                </tr>
                <tr>
                    <td><CalcButton caption="1" tag="1" keybind="1" action={Actions.ADD_NUMBER}/></td>
                    <td><CalcButton caption="2" tag="2" keybind="2" action={Actions.ADD_NUMBER}/></td>
                    <td><CalcButton caption="3" tag="3" keybind="3" action={Actions.ADD_NUMBER}/></td>
                    <td><CalcButton caption="-" tag="-" keybind="-" action={Actions.OPERATION}/></td>
                    <td><CalcButton caption="Swap" keybind="PageDown" action={Actions.SWAP}/></td>
                </tr>
                <tr>
                    <td><CalcButton caption="0" tag="0" keybind="0" action={Actions.ADD_NUMBER}/></td>
                    <td><CalcButton caption="." tag="." keybind="." action={Actions.ADD_NUMBER}/></td>
                    <td><CalcButton caption="-x" tag="uminus" action={Actions.OPERATION}/></td>
                    <td><CalcButton caption="+" tag="+" keybind="+" action={Actions.OPERATION}/></td>
                    <td><CalcButton caption="Reset" keybind="Escape" action={Actions.CLEAR}/></td>
                </tr>
                <tr>
                    <td><CalcButton caption="√" tag="sqrt" action={Actions.OPERATION}/></td>
                    <td><CalcButton caption="x²" tag="sqr" action={Actions.OPERATION}/></td>
                    <td/>
                    <td/>
                    <td><CalcButton caption="Enter" keybind="Enter" action={Actions.ENTER}/></td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default App;
