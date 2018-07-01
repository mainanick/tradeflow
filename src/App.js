import React, { Component } from 'react';
import Trade from './Trade';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h3>Uses the 2007 HS (Harmonized System) trade classification. Data from: https://atlas.media.mit.edu</h3>
        <Trade />
      </div>
    );
  }
}

export default App;
