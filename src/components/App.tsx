import React from 'react';
import './App.css';
import Button from './Button';
import ExpressionStack from "./ExpressionStack";
import InputPanel from "./InputPanel";
import Actions from "../dispatcher/Actions";

const App: React.FC = () => {

  return (
      <div className="App">
        <ExpressionStack/>
          <InputPanel/>
          <table>
            <tbody>
            <tr>
              <td><Button capture="7" tag="7" keybind="7" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="8" tag="8" keybind="8" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="9" tag="9" keybind="9" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="/" tag="/" keybind="/" action={Actions.OPERATION}/></td>
            </tr>
            <tr>
              <td><Button capture="4" tag="4" keybind="4" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="5" tag="5" keybind="5" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="6" tag="6" keybind="6" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="*" tag="*" keybind="*" action={Actions.OPERATION}/></td>
            </tr>
            <tr>
              <td><Button capture="1" tag="1" keybind="1" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="2" tag="2" keybind="2" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="3" tag="3" keybind="3" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="-" tag="-" keybind="-" action={Actions.OPERATION}/></td>
            </tr>
            <tr>
              <td><Button capture="0" tag="0" keybind="0" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="." tag="." keybind="." action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="Clear" tag="clear" keybind="Delete" action={Actions.DEL}/></td>
              <td><Button capture="+" tag="+" keybind="+" action={Actions.OPERATION}/></td>
            </tr>
            <tr>
              <td><Button capture="<-" keybind="Backspace" action={Actions.BS}/></td>
              <td><Button capture="Enter" keybind="Enter" action={Actions.ENTER}/></td>
              <td><Button capture="Reset" keybind="Escape" action={Actions.CLEAR}/></td>
              <td><Button capture="Swap" keybind="PageDown" action={Actions.SWAP}/></td>
            </tr>
            </tbody>
          </table>
      </div>
  );
};

export default App;
