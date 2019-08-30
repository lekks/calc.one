import React from 'react';
import './App.css';
import Button from './Button';
import ExpressionPanel from "./ExpressionPanel";
import ResultPanel from "./ResultPanel";
import Actions from "../actions/Actions";

const App: React.FC = () => {

  return (
      <div className="App">
          <ExpressionPanel/>
          <ResultPanel/>
          <table>
            <tbody>
            <tr>
              <td><Button capture="1" tag="1" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="2" tag="2" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="3" tag="3" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="+" tag="+" action={Actions.ADD_NUMBER}/></td>
            </tr>
            <tr>
              <td><Button capture="4" tag="4" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="5" tag="5" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="6" tag="6" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="-" tag="-" action={Actions.ADD_NUMBER}/></td>
            </tr>
            <tr>
              <td><Button capture="7" tag="7" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="8" tag="8" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="9" tag="9" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="*" tag="*" action={Actions.ADD_NUMBER}/></td>
            </tr>
            <tr>
              <td><Button capture="0" tag="0" action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="." tag="." action={Actions.ADD_NUMBER}/></td>
              <td><Button capture="Clear" tag="clear" action={Actions.CLEAR}/></td>
              <td><Button capture="/" tag="/" action={Actions.ADD_NUMBER}/></td>
            </tr>
            <tr>
              <td><Button capture="<-" tag="bs" action={Actions.BS}/></td>
            </tr>
            </tbody>
          </table>
      </div>
  );
};

export default App;
