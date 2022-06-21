import React, { Component } from 'react';
import './App.css';
import Drag from './Drag';
import Grid from './grid/Grid';

function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


export interface Item {
  type?: string;
  top: number;
  left: number;
  width: number;
  height: number;
  index?: number;
  value?: string;
  current?: boolean;
  id?: string;
}
interface State {
  items: Item[] 
  items2: Item[]
}
class App extends Component<{}, State> {
  constructor(props) {
    super(props);

    this.el = null;
    this.state = {
      items2: [
        {
          type: "image",
          top: 0,
          left: 0,
          index: 1,
          width: 200,
          height: 200,
          value: 'https://media.deca.art/static/0x495f947276749ce646f68ac8c248420045cb7b5e/20973156443705115113792982080402275335274697976325416737038491145560934842369?width=1000',
          current: false,
        },
        {
          type: "image",
          top: 300,
          left: 0,
          index: 1,
          width: 200,
          height: 200,
          value: 'https://media.deca.art/static/0x495f947276749ce646f68ac8c248420045cb7b5e/48037275871633193830421594285625459086251650415150495168122987868918474866689?width=1000',
          current: false,
        },
        {
          type: "image",
          top: 0,
          left: 300,
          index: 1,
          width: 200,
          height: 200,
          value: 'https://media.deca.art/static/0xaA20f900e24cA7Ed897C44D92012158f436ef791/161?width=1000',
          current: false,
          id: getUUID(),
        },
        {
          type: "text",
          top: 0,
          left: 300,
          index: 1,
          width: 200,
          height: 50,
          value: '',
          current: false,
        }
      ],
      items: JSON.parse(localStorage.getItem('items')) || []
    }
  }

  el: any;

  handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  renderItem(item: Item) {
    if (item.type === 'image') {
      return  <div className="image-content"><img src={item.value} alt="" /></div>
    }

    if (item.type === 'text') {
      return  <input onChange={(e) => this.handleInputChange(e, item)} value={item.value} />;
    }

     
    return null;
  }

  handleClickItem = (_item: Item) => {
    const items = this.state.items.map(item => {
      if (_item.id === item.id) {
        item.current = true;
      } else {
        item.current = false;
      }

      return {
        ...item
      };
    })
    this.setState({ items });
  }

  handleDrop = (e) => {
    const rect = this.el.getBoundingClientRect();

    const top = e.clientY - rect.y;
    const left = e.clientX - rect.x;
    const item = JSON.parse(e.dataTransfer.getData("item"));
    const offsetX = Number(e.dataTransfer.getData("offsetX"));
    const offsetY = Number(e.dataTransfer.getData("offsetY"));

    const items = [...this.state.items, {
      ...item,
      top: top - offsetY,
      left: left - offsetX,
      id: getUUID(),
    }];

    localStorage.setItem('items', JSON.stringify(items))
    this.setState({
      items
    });
  }

  handleDragStart = (e, item: Item) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setData('offsetX', offsetX);
    e.dataTransfer.setData('offsetY', offsetY);
    e.dataTransfer.setData('item', JSON.stringify(item));
  }

  renderDragItem = (item: Item) => {
    if (item.type === 'image') {
      return (
        <div className="image-content" onDragStart={e => this.handleDragStart(e, item)} draggable style={{
          width: item.width,
          height: item.height
        }}>
          <img src={item.value} alt="" />
        </div>
      )
    } else if (item.type === 'text') {
      return (
        <div
          className="text-content" onDragStart={e => this.handleDragStart(e, item)} draggable style={{
          width: item.width,
          height: item.height
        }}>
          <input onChange={(e) => this.handleInputChange(e, item)} />
        </div>
      )
    }

    return null;
  }

  handleInputChange(e, item: Item) {
    item.value = e.target.value;
    this.forceUpdate()
  }

  reset = () => {
    this.setState({items: []});
    localStorage.removeItem('items')
  }

  
  render() {
    return (
      <div className="app" >
        <div className="app-left">
          <div className="tab-content">
            {
              this.state.items2.map(item =>this.renderDragItem(item))
            }
          </div>
          <button onClick={this.reset}>Reset</button>
        </div>
        <div className="app-right" onDragOver={this.handleDragOver} onDrop={this.handleDrop} ref={el => this.el = el}>
          <Grid />
          {
            this.state.items.map(item => {
              return (
                <Drag container=".app" item={{...item}} handleClickItem={this.handleClickItem} key={item.id}>
                  {
                    this.renderItem(item)
                  }
                </Drag>
              )
            })
          }
        </div>
      </div>
    );
  }
}
export default App;
