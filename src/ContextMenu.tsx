import React from 'react';
import "./ContextMenu.scss";

export default function ContextMenu(props) {
  if (!props.isShow) {
    return null;
  }
  return (
    <div className="contextmenu" style={{ left: props.left, top: props.top }}>
        <ul>
          <li onClick={props.removeItem}>删除</li>
          <li onClick={e => props.moveItem(e, 'top')}>置顶</li>
          <li onClick={e => props.moveItem(e, 'bottom')}>置底</li>
          <li onClick={e => props.moveItem(e, 'up')}>上移</li>
          <li onClick={e => props.moveItem(e, 'down')}>下移</li>
        </ul>
    </div>
  )
}