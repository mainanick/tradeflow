import React, { Component } from 'react';
import Trade from './Trade';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title"></h1>
        </header>
        <Trade />
        <p className="App-intro">
        </p>
      </div>
    );
  }
}

export default App;
