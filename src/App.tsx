import React, { Component } from 'react';
import './App.css';
import Drag from './Drag';
import Grid from './grid/Grid';
import ContextMenu from './ContextMenu';

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
  items: Item[],
  items2: Item[],
  contextPos: any,
  currentID: string,
  isShowContext: boolean,
  snapshots: State['items'][],
  snapshotsIndex: number,
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
          value: 'https://media.deca.art/static/0xb80fBF6cdb49c33dC6aE4cA11aF8Ac47b0b4C0f3/10143?width=1000',
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
          height: 32,
          value: '',
          current: false,
        }
      ],
      items: JSON.parse(localStorage.getItem('items')) || [],
      contextPos: {
        left: 0,
        right: 0
      },
      currentID: "",
      isShowContext: false,
      snapshots: [JSON.parse(localStorage.getItem('items')) || []],
      snapshotsIndex: 0
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
    this.setState({ items, currentID: _item.id, isShowContext: false, });
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
      index: this.state.items.length + 1
    }];

    let snapshots = [...this.state.snapshots, items];

    if (this.state.snapshotsIndex < this.state.snapshots.length - 1) {
      snapshots = snapshots.slice(0, this.state.snapshotsIndex + 1);
    }
    localStorage.setItem('items', JSON.stringify(items));

    this.setState({
      items,
      snapshots,
      snapshotsIndex: this.state.snapshotsIndex + 1
    });
  }

  handleDragStart = (e, item: Item) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    if (item.type === 'text') {
      item.value = item.value || "edit..."
    }
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
    localStorage.removeItem('items');
  }

  undo = () => {
    const {snapshots, snapshotsIndex} = this.state;
    if (snapshotsIndex <= 0) {
      return;
    }
    const index = snapshotsIndex - 1;
    this.setState({
      snapshotsIndex: index,
      items: snapshots[index],
    });
    localStorage.setItem('items', JSON.stringify(snapshots[index]));
  }
  redo = () => {
    const {snapshots, snapshotsIndex} = this.state;

    if (snapshotsIndex === snapshots.length - 1) {
      return;
    }

    const index = snapshotsIndex + 1;
    localStorage.setItem('items', JSON.stringify(snapshots[index]));
    this.setState({
      snapshotsIndex: index,
      items: snapshots[index],
    });
  }

  handleClickBlank = () => {
    const items = this.state.items.map(item => {
      return {
        ...item,
        current: false,
      };
    });

    this.setState({ items, currentID: "", isShowContext: false, });
  }

  handleContextMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      isShowContext: true,
      contextPos: {
        left: e.clientX,
        top: e.clientY,
      }
    })
  }

  handleRemoveItem = (e) => {
    e.stopPropagation();
    const {items, currentID} = this.state;
    const newItems = [...items];
    const index = items.findIndex(item => item.id === currentID);
    newItems.splice(index, 1);
    this.setState({items: newItems, isShowContext: false});
  }

  handleMoveItem = (e, type) => {
    e.stopPropagation();
    const items = [...this.state.items];
    const index = items.findIndex(item => item.id === this.state.currentID);
    const currentItem = items[index];
    if (type === 'top') {
      items.splice(index, 1);
      items.push(currentItem);
    } else if (type === 'bottom') {
      items.splice(index, 1);
      items.unshift(currentItem);
    } else if (type === 'up') {
      if (index < items.length - 1) {
        const temp = items[index + 1];
        items[index + 1] = currentItem;
        items[index] = temp;
      }
    } else if (type === 'down') {
      if (index > 0) {
        const temp = items[index - 1];
        items[index - 1] = currentItem;
        items[index] = temp;
      }
    }

    this.setState({items, isShowContext: false});
  }

  handleDragEnd = (item: Item) => {
    const items = [...this.state.items];

    const index = items.findIndex(({id}) => item.id === id);
    console.log(items)

    items.splice(index, 1, item);
    console.log(items)
    let snapshots = [...this.state.snapshots, items];

    if (this.state.snapshotsIndex < this.state.snapshots.length - 1) {
      snapshots = snapshots.slice(0, this.state.snapshotsIndex + 1);
    }
    localStorage.setItem('items', JSON.stringify(items));
    this.setState({
      items,
      snapshots,
      snapshotsIndex: this.state.snapshotsIndex + 1
    });
  }

  render() {
    const {contextPos, isShowContext} = this.state;
    return (
      <div className="app">
        <ContextMenu
          left={contextPos.left}
          top={contextPos.top}
          isShow={isShowContext}
          removeItem={this.handleRemoveItem}
          moveItem={this.handleMoveItem}
        />
        <div className="app-left">
          <div className="tab-content">
            {
              this.state.items2.map(item =>this.renderDragItem(item))
            }
          </div>
          <button onClick={this.reset}>Reset</button>
          <button onClick={this.undo}>Undo</button>
          <button onClick={this.redo}>Redo</button>
        </div>
        <div className="app-right" onDragOver={this.handleDragOver} onDrop={this.handleDrop} ref={el => this.el = el} onClick={this.handleClickBlank}>
          <Grid />
          {
            this.state.items.map(item => {
              return (
                <Drag container=".app" item={item} handleClickItem={this.handleClickItem} key={item.id} handleContextMenu={this.handleContextMenu} handleDragEnd={this.handleDragEnd}>
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
