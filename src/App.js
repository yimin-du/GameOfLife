import React, { Component } from 'react';
import Board from './board';
import $ from 'jquery';

let row = 60, col = 60, n = row * col;
let generation = 0;
let intervalID;

export default class App extends Component {
  constructor() {
  	super();
  	// generate random life status for each cell
  	// and set it as state
  	let cells = [];
  	const statusMap = { 0: 'dead', 1: 'newborn', 2: 'alive' };
  	for(let i = 0; i < n; i++) {
  		let randomStatus = Math.round(Math.random() * 3);
  		cells.push({life: statusMap[randomStatus]});
  	}

  	this.state = { board: cells };

  	this.startLife = this.startLife.bind(this);
  	this.clearBoard = this.clearBoard.bind(this);

  	this.countNeigbours = this.countNeigbours.bind(this);
  	this.startLife();
  }

  componentDidMount() {
  	const _this = this;
  	$('#runBtn').click(function() {

  		_this.startLife(); 
  	});
  	$('#pauseBtn').click(function() { 
  		clearInterval(intervalID); 

  	});
  	$('#clearBtn').click(function() { 
  		_this.clearBoard(); 
  	});

  	for(let i = 0; i < n; i++) {
  		$('#' + i).click(function() {
  			let newstatus = _this.state.board[i].life === 'newborn' ? 'dead' : 'newborn';
  			let board = _this.state.board;
  			board[i].life = newstatus;
  			_this.setState({board});
  		});
  	}
  }

  clearBoard() {
  	let board = [];
  	for(let i = 0; i < n; i++) {
  		board.push({life: 'dead'});
  	}
  	this.setState({board});
  	generation = 0;
  	$('.gen-label').text('Generation 0');
  }

  countNeigbours(_this, i) {
  	let adjs = [];
  	if(this.onFirstCol(i) && this.onFirstRow(i)) {
  		adjs = [i + 1, i + col, i + col + 1];
  	} else if(this.onFirstRow(i) && this.onLastCol(i)){
  		adjs = [i - 1, i + col, i + col - 1];
  	} else if(this.onLastRow(i) && this.onFirstCol(i)) {
  		adjs = [i - col, i + 1, i - col + 1];
  	} else if(this.onLastRow(i) && this.onLastCol(i)) {
  		adjs = [i - 1, i - col, i - col - 1];
  	} else if(this.onFirstRow(i)) {	// at top row
  		adjs = [i + 1, i - 1, i + col, i + col - 1, i + col + 1];
  	} else if(this.onFirstCol(i)) {	// at col0
  		adjs = [i - col, i + col, i + 1, i - col + 1, i + col + 1];
  	} else if(this.onLastCol(i)){    // at right-most col
  		adjs = [i - 1, i - col, i + col, i - col - 1, i - col - 1, i + col - 1];
  	} else if(this.onLastRow(i)) {	// at bottom row
  		adjs = [i - col, i - col - 1, i - 1, i + 1, i - col + 1];
  	} else {	// not on any edge
  		adjs = [i + 1, i - 1, i - col, i + col, i + col - 1, i + col + 1, i - col + 1, i - col - 1];
  	}

  	let count = 0;
  	adjs.forEach(function(e) {
  		if(_this.state.board[e].life === 'newborn' || _this.state.board[e].life === 'alive') {
  			count++;
  		}
  	});

  	return count;
  }

  startLife() {
  	if(this.allDead())	return;
  	console.log("start life!");

  	// update state at each tick
  	const _this = this;
  	intervalID = setInterval(function(){
  		if(_this.allDead()) {
  			clearInterval(intervalID);
  			$('.gen-label').text("Generation " + generation++);
  		}

  		let nextBoardState = [];
  		for(let i = 0; i < n; i++) {
  			const curBoardState = _this.state.board;

  			let numNeighbours = _this.countNeigbours(_this,i);
  			let curState = curBoardState[i].life;
  			let nextState;
  			
  			if(curState === 'dead') {
  				if(numNeighbours === 3) {
  					nextState = 'newborn';
  				} else {
  					nextState = 'dead';
  				}
  			} else {
  				if(numNeighbours === 2 || numNeighbours === 3) {
  					nextState = 'alive';
  				} else {
  					nextState = 'dead';
  				}
  			}
  			
  			nextBoardState.push({life: nextState});
  		}
  		
  		_this.setState({board: nextBoardState});

  		$('.gen-label').text("Generation " + generation++);
  	}, 1);
  }

  allDead() {
  	const board = this.state.board;
  	let dead = true;
  	for(let i = 0; i < n; i++){
  		if(board[i].life !== 'dead'){
  			dead = false;
  			return dead;
  		}
  	}

  	return dead;
  }

  onFirstRow(i) {
  	return (i >= 0) && (i < col);
  }

  onFirstCol(i) {
  	return (i % col === 0) || (i === 0);
  }

  onLastRow(i) {
  	return (i < n) && (i >= n - col);
  }

  onLastCol(i) {
  	return ((i + 1) % col) === 0;
  }

  

  render() {
    return (
    	<div>
	    	<Board board = {this.state.board} />
    		<div className="control-bar">
	    		<button id="runBtn" className="btn btn-info">Run</button>
	    		<button id="pauseBtn" className="btn btn-info">Pause</button>
	    		<button id="clearBtn" className="btn btn-info">Clear</button>
	    		<span className="gen-label">Generation: 0</span>
	    	</div>
    	</div>
    );
  }
}
