import React, { Component } from 'react';
import Trade from './Trade';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <p style={{fontStyle: "italic", fontSize: "0.8em"}}>Uses the 2007 HS (Harmonized System) trade classification. Data from: https://atlas.media.mit.edu</p>
        <Trade style={{marginTop: "30px"}}/>
      </div>
    );
  }
}

export default App;
