import React, { Component } from 'react';

import { Chart, Tooltip, Legend, Polygon } from 'viser-react';
import DataSet from  '@antv/data-set';

import HS07 from './HS07';


class TreeChart extends Component {

  render() {

    const dv = new DataSet.View().source( {
        name: 'root',
        children:this.props.data
      }, {
      type: 'hierarchy',
    });
    
    dv.transform({
      field: 'import_val',
      type: 'hierarchy.treemap',
      tile: 'treemapResquarify',
      as: ['x', 'y'],
    });
    const data = dv.getAllNodes().map((node) => (console.log(node), {
      ...node,
      name: node.data.name,
      value: node.value,
    }));
    
    const scale = [{
      dataKey: 'import_val',
      nice: false,
    }];
    
    const itemTpl = `
      <li data-index={index}>
        <span style="background-color:{color};" class="g2-tooltip-marker"></span>
        {name}<br/>
        <span style="padding-left: 16px">Deficit：{count}</span><br/>
      </li>`;
    
    const style = {
      lineWidth: 1,
      stroke: '#fff',
    };
    
    const tooltip = ['name', (name, count) => ({ name, count })];
    
    const label = ['name', {
      offset: 0,
      textStyle: {
        textBaseline: 'middle',
      },
      formatter(val) {
        if (val !== 'root') {
          return val;
        }
      }
    }];
  
    return (
     
      <div>
        <Chart height={1000} data={data} scale={scale} padding={0}>
          <Tooltip showTitle={false} itemTpl={itemTpl} />
          <Polygon position="x*y" color="name" tooltip={tooltip} style={style} label={label} />
        </Chart>
    </div>
    );
  }
}

export default TreeChart;
