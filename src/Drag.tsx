import React, { Component } from 'react';
import "./Drag.scss";
import type { Item } from './App';

enum Point {
  East = 'east',
  West = 'west',
  South = 'south',
  North = 'north',
  Northeast = 'northeast',
  Northwest = 'northwest',
  Southeast = 'southeast',
  Southwest = 'southwest',
}

interface State {
  style: {
    width: number,
    height: number,
    top: number,
    left: number,
    index?: number,
  },
  isMouseDown: boolean,
}

interface Props {
  container: HTMLElement | string;
  item: Item,
  children: React.ReactNode;
  handleClickItem: (item: Item) => void;
  handleContextMenu: (e) => void;
  handleDragEnd: (item: Item) => void;
}

export default class Drag extends Component<Props, State> {
  constructor(props) {
    super(props);

    const {width, height, left, top, index} = this.props.item;

    this.state = {
      style: {
        width,
        height,
        left,
        top,
        index,
      },
      isMouseDown: false
    }
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
      this.setState({
        style: {
          width: nextProps.item.width,
          height: nextProps.item.height,
          left: nextProps.item.left,
          top: nextProps.item.top,
        }
      })
  }

  handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const {item, handleClickItem, handleDragEnd} = this.props;
    handleClickItem(item);

    const startX = e.clientX;
    const startY = e.clientY;
    const style = {...this.state.style};

    const left = style.left;
    const top = style.top;
    this.setState({isMouseDown: true});

    const handleMouseMove = (e: MouseEvent) => {
      e.stopPropagation();

      if (!this.state.isMouseDown) {
        return;
      }

      const currentX = e.clientX;
      const currentY = e.clientY;

      style.left = currentX - startX + left;
      style.top = currentY - startY + top;

      this.setState({ style });
    }

    const handleMouseUp = () => {
      handleDragEnd({...item, ...style})
      this.setState({isMouseDown: false});
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  handleMouseDownOnPoint = (point: Point, e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const style = { ...this.state.style };
    const { left, top, width, height } = style;
    const {item, handleDragEnd} = this.props;
  
    const handleMouseMove = (e) => {
      const offsetX = e.clientX - startX;
      const offsetY = e.clientY - startY;
    
      switch(point) {
        case Point.East: {
          style.width = width + offsetX;
          break;
        }

        case Point.West: {
          style.width = width - offsetX;
          style.left = left + offsetX;
          break;
        }

        case Point.North: {
          style.height = height - offsetY;
          style.top = top + offsetY;
          break;
        }

        case Point.South: {
          style.height = height + offsetY;
          break;
        }

        case Point.Northeast: {
          style.height = height - offsetY;
          style.top = top + offsetY;
          style.width = width + offsetX;
          break;
        }

        case Point.Northwest: {
          style.height = height - offsetY;
          style.top = top + offsetY;
          style.width = width - offsetX;
          style.left = left + offsetX;
          break;
        }

        case Point.Southeast: {
          style.height = height + offsetY;
          style.width = width + offsetX;
          break;
        }

        case Point.Southwest: {
          style.height = height + offsetY;
          style.width = width - offsetX;
          style.left = left + offsetX;
          break;
        }
      }
      this.setState({style});
    }

    const handleMouseUp = () => {
      handleDragEnd({...item, ...style})
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  handleClickItem = (e) => {
    const {item, handleClickItem} = this.props;
    e.preventDefault();
    e.stopPropagation();

    handleClickItem(item);
  }

  render() {
    const {isMouseDown} = this.state;
    const {children, item, handleContextMenu} = this.props;
    const points = [
      Point.Northwest,
      Point.North,
      Point.Northeast,
      Point.East,
      Point.Southeast,
      Point.South,
      Point.Southwest,
      Point.West
    ];
  
    return (
      <div className={"drag-wrapper"}
        style={{
          outline: item.current && "2px solid #70c0ff",
          cursor: isMouseDown ? 'grabbing' : 'pointer',
          ...this.state.style
        }}
        onMouseDown={this.handleMouseDown}
        onClick={this.handleClickItem}
        onContextMenu={handleContextMenu}
      >
        {
          points.map(point => (
            <div className={`drag-point point-${point}`} onMouseDown={e => this.handleMouseDownOnPoint(point, e)}></div>
          ))
        }
        <div className="drag-item">
          {children}
        </div>
      </div>
    )
  }
}