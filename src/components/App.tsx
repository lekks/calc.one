import React from 'react';
import logo from '../logo.svg';
import './App.css';
import Button from './Button';
import ExpressionPanel from "./ExpressionPanel";
import ResultPanel from "./ResultPanel";

const App: React.FC = () => {

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <ExpressionPanel/>
          <ResultPanel/>

          <Button capture="1"/>
          <Button capture="2"/>
          <Button capture="3"/>
          <Button capture="4"/>
          <Button capture="+"/>
          <Button capture="-"/>
          <Button capture="*"/>
          <Button capture="/"/>

        </header>
      </div>
  );
};

export default App;
