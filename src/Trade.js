import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import FlagKenya from './FlagKenya';
import HS07 from './HS07';

function formatCurrency(amount){
  return amount? amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : undefined
}

function sanitise(x) {
  if (isNaN(x)) {
    return 0;
  }
  return x;
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
      sorter: {
        id: "import_val",
        desc: true
      },
      loading: true,
      results: []
    }

    this.changeTradeYear = this.changeTradeYear.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.loadingOrFailMessage = this.loadingOrFailMessage.bind(this);
    this.sortBy = this.sortBy.bind(this);
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
    return `https://atlas.media.mit.edu/hs07/${tradeFlow}/${year}/${origin}/${destination}/${product}/`
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
    return HS07[id.toLocaleString()].name
  }

  sortBy(ev){ 
    // remove the synthetic event from the pool and allow references to the event to be retained 
    ev.persist()
    
    if(ev.detail === 0){
      let fieldSelected = ev.target.value;
      if(fieldSelected === this.state.sorter.id){
        // Change desc to asc vice-versa
        this.setState({sorter: {...this.state.sorter, desc:!this.state.sorter.desc} });
      } else {
        this.setState({sorter: {...this.state.sorter, id:fieldSelected} })
      }
      
    }
  }
  
  
  render() {
    const allowedYears = [2012, 2013, 2014, 2015, 2016];
    const viewableColumns = [{
      name: "Product Name", valueAccessor: "name"
      },{
        name: "Import Value", valueAccessor: "import_val"
      },{
        name: "Export Value", valueAccessor: "export_val"
      }
    ];
    
    const columns = [{
      Header: 'Product',
      accessor: 'name',
      Cell: (row) => <div style={{textAlign: "left", margin: 0}}> {row.value} </div>,
      filterMethod: (filter, row) => row[filter.id].includes(filter.value) 
    },{
      Header: 'Import Value',
      accessor: 'import_val',
      Cell: row => <div>{formatCurrency(row.value)} </div>,
      maxWidth: 150,
      filterable: false,
    },{
      Header: 'Export Value',
      accessor: 'export_val',
      Cell: row => <div>{formatCurrency(row.value)} </div>,
      maxWidth: 150,
      filterable: false,
    },{
      Header: '',
      id: "sum",
      filterable: false,
      resizable: false,
      sortable: false,
      accessor: d => (d.import_val/d.total_trade)*100,
      Cell: row => <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#85cc00',
            borderRadius: '2px'
          }}
        >
          <div
            style={{
              width: `${row.value}%`,
              height: '100%',
              backgroundColor: '#ff2e00',
              borderRadius: '2px',
              transition: 'all .2s ease-out'
            }}
          />
        </div>,
      maxWidth: 200
    }]
    
    return (
     
      <React.Fragment>
        <div style={{float: "left"}}>
          <FlagKenya /> Kenya <span></span>
          Year: <select onChange={this.changeTradeYear} value={this.state.year}>
            {allowedYears.map((year, index)=><option key={index} value={year}>{year}</option>)}
          </select>
          Sort By: 
          <select onClick={this.sortBy} defaultValue={this.state.sorter.id}>
            {viewableColumns.map((field, index)=><option key={index} value={field.valueAccessor}>{field.name}</option>)}
          </select>
        </div>
        <ReactTable
          className="-striped -highlight"
          style={{marginTop: '50px'}}
          columns={columns}
          data={this.state.results}
          noDataText={this.loadingOrFailMessage()}
          defaultPageSize={20}
          defaultSorted={[
            this.state.sorter
          ]}
          resolveData={data => data.map(row => {
            return {name: this.getProductName(row.hs07_id), total_trade: (sanitise(row.import_val) +sanitise(row.export_val)), ...row}
            }
          )}
          getTdProps={(_, rowInfo) => {
            return {
              onClick: () => {
                console.log("Row Clicked:", rowInfo.original.hs07_id);
              }
            };
          }}
          loading={this.state.loading}
          filterable
          showPaginationBottom
        />
    </React.Fragment>
    );
  }
}

export default Trade;
