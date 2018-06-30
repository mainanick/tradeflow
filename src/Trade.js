import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import HS92 from './HS92';

function formatCurrency(amount){
  return amount? amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : undefined
}

class Trade extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      tradeFlow: "import",
      year: 2016,
      origin: "ken",
      destination: "all",
      product: "show"
    }

    this.changeTradeYear = this.changeTradeYear.bind(this);
    this.fetchData =this.fetchData.bind(this);
  }
  
  componentDidMount(){
    this.fetchData();
  }
  
  componentDidUpdate(prevProps, prevState){
    if (prevState.year !== this.state.year){
      this.fetchData();
    }
  }
  
  getTradeURL(){
    // TRADE_FLOW / YEAR / ORIGIN / DESTINATION / PRODUCT /
    const { tradeFlow, year, origin, destination, product } = this.state;
    return `https://atlas.media.mit.edu/hs92/${tradeFlow}/${year}/${origin}/${destination}/${product}/`
  }
  
  fetchData(){
    const URL = this.getTradeURL();
    fetch(URL)
    .then(res=>res.json())
    .then(res=>this.setState({results: res.data}));
  }
  
  changeTradeYear(ev){
    this.setState({year: ev.target.value})
  }
  
  getProductName(id){
    return HS92[id.toLocaleString()].name
  }
  
  render() {
    const allowedYears = [2012,2013, 2014, 2015, 2016];
    const columns = [{
      Header: 'Product',
      accessor: 'hs92_id',
      Cell: row => <a> {this.getProductName(row.value)} </a>
    },{
      Header: 'Import Value',
      accessor: 'import_val',
      Cell: row => <a>{formatCurrency(row.value)} </a>
    },{
      Header: 'Export Value',
      accessor: 'export_val',
      Cell: row => <a>{formatCurrency(row.value)} </a>
    }]
  
    if (!this.state.results){
      return <h3>Fetching data...</h3>;
    }
    
    return (
      <div>
        <select onChange={this.changeTradeYear} value={this.state.year}>
          {allowedYears.map((year, index)=><option key={index} value={year}>{year}</option>)}
        </select>
    
        <ReactTable
          data={this.state.results}
          defaultPageSize={20}
          columns={columns}
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: () => {
                console.log("Row Clicked:", rowInfo.original.hs92_id);
              }
            };
          }}
        />
    </div>
    );
  }
}

export default Trade;
