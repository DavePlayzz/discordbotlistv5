import React, { Component } from 'react';
import Modesta from '../../data/Modesta';

class Column extends Component {
  render() {
    return (
      <div {...this.props} className={`${Modesta.column} ${this.props.className || ''}`}>
        {this.props.children}
      </div>
    )
  }
}

export default Column;
