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
}
class App extends Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = {
      items: [
        {
          type: "image",
          top: 0,
          left: 0,
          index: 1,
          width: 200,
          height: 150,
          value: require('./default.jpg'),
          current: false,
          id: getUUID(),
        },
        {
          type: "image",
          top: 300,
          left: 0,
          index: 1,
          width: 200,
          height: 150,
          value: 'https://cdn-images.chanmama.com/douyin/product/bfbbce821dc8c503f51c4f93357b8452.jpeg?source=https%3A%2F%2Fp3-aio.ecombdimg.com%2Flarge%2Ftemai%2Febf0d190c54a95b37a7187dc855a8b69www800-800',
          current: false,
          id: getUUID(),
        },
        {
          type: "image",
          top: 0,
          left: 300,
          index: 1,
          width: 200,
          height: 150,
          value: require('./default.jpg'),
          current: false,
          id: getUUID(),
        }
      ]
    }
  }

  handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  renderItem(item: Item) {
    if (item.type === 'image') {
      return <img src={item.value} alt="" />
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

  
  render() {
    return (
      <div className="App" >
        <Grid />
        {
          this.state.items.map(item => {
            return (
              <Drag container=".App" item={{...item}} handleClickItem={this.handleClickItem} key={item.id}>
                {
                  this.renderItem(item)
                }
              </Drag>
            )
          })
        }
      </div>
    );
  }
}
export default App;
