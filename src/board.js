import React, { Component } from 'react';
import classNames from 'classnames';

export default class Board extends Component {
	render() {
		let i = 0;
		return(
			<div id="board">
				{ this.props.board.map( cell => {
					return(<div key={i++} id={i} className={ classNames('cell', {
						'alive': cell.life === 'alive',
						'dead': cell.life === 'dead',
						'newborn': cell.life === 'newborn'}) }></div>);
				}) }
			</div>
		);
	}
}