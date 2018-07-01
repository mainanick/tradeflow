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
      product: "show",
      loading: true
    }

    this.changeTradeYear = this.changeTradeYear.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.loadingOrFailMessage = this.loadingOrFailMessage.bind(this);
  }
  
  componentDidMount(){
    this.fetchData();
  }
  
  componentDidUpdate(prevProps, prevState){
    if (prevState.year !== this.state.year){
      this.fetchData();
    }
  }
  
  loadingOrFailMessage(){
    return this.state.loading? "Fetching data" : "Oh Noes! Check your Network or try again after sometime"
  }
  
  getTradeURL(){
    // TRADE_FLOW / YEAR / ORIGIN / DESTINATION / PRODUCT /
    const { tradeFlow, year, origin, destination, product } = this.state;
    return `https://atlas.media.mit.edu/hs92/${tradeFlow}/${year}/${origin}/${destination}/${product}/`
  }
  
  fetchData(){
    const URL = this.getTradeURL();
    fetch(URL)
    .then(res=> {
      if(!res.ok){
        this.setState({results: [], loading:false});
      }
      return res.json()
    })
    .then(res=>this.setState({results: res.data, loading:false}))
    .catch(err=>this.setState({results: [], loading:false}));
  }
  
  changeTradeYear(ev){
    this.setState({year: ev.target.value})
  }
  
  getProductName(id){
    return HS92[id.toLocaleString()].name
  }
  
  render() {
    const allowedYears = [2012, 2013, 2014, 2015, 2016];
    const columns = [{
      Header: 'Product',
      accessor: 'name',
      Cell: row => <a> {row.value} </a>
    },{
      Header: 'Import Value',
      accessor: 'import_val',
      Cell: row => <a>{formatCurrency(row.value)} </a>
    },{
      Header: 'Export Value',
      accessor: 'export_val',
      Cell: row => <a>{formatCurrency(row.value)} </a>
    }]
    
    return (
      <div>
        <select onChange={this.changeTradeYear} value={this.state.year}>
          {allowedYears.map((year, index)=><option key={index} value={year}>{year}</option>)}
        </select>
    
        <ReactTable
          className="-striped -highlight"
          columns={columns}
          data={this.state.results}
          noDataText={this.loadingOrFailMessage()}
          defaultPageSize={20}
          defaultSorted={[
            { id: "import_val", desc: true }
          ]}
          resolveData={data => data.map(row => {
            return {name: this.getProductName(row.hs92_id),...row}
            }
          )}
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: () => {
                console.log("Row Clicked:", rowInfo.original.hs92_id);
              }
            };
          }}
          loading={this.state.loading}
          filterable
          showPaginationTop
          showPaginationBottom
        />
    </div>
    );
  }
}

export default Trade;
