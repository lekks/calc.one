import React from 'react';
import logo from '../logo.svg';
import './App.css';
import Button from './Button';
import Board from "./Board";

const App: React.FC = () => {

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <Board/>

          <Button capture="1"/>
          <Button capture="2"/>

        </header>
      </div>
  );
};

export default App;
