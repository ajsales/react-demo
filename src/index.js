import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{'background': props.onWinningLine ? 'yellow' : 'white'}}
    >
      {props.value}
    </button>
  );
}



class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        onWinningLine={this.props.winningLine ? this.props.winningLine.includes(i) : null}
      />
    );
  }

  render() {
    let counter = 0;
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(counter));
        counter++;
      }
      rows.push(<div key={i} className="board-row">{row}</div>);
    }
    return <div>{rows}</div>
    
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        pos: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      movesDescending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        pos: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const win = calculateWinner(current.squares);

    if (!this.state.movesDescending) {
      history = history.slice(0).reverse();
    }
    
    const moves = history.map((step, index) => {
      const move = this.state.movesDescending ? index : (history.length - index - 1);
      const desc = move ?
        'Go to move #' + move + ': ' + indexToColRow(step.pos) :
        'Go to game start';
      return (
        <li key={step}>
          <button
            onClick={() => this.jumpTo(move)}
            style={{
              'fontWeight': move === this.state.stepNumber ?'bold' : 'normal'
            }}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    let winningLine;
    if (win) {
      status = 'Winner: ' + win[0];
      winningLine = win[1];
    } else if (!current.squares.includes(null)) {
      status = 'Draw!';
    } else {

      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningLine={winningLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() => {
              this.setState({
                movesDescending: !this.state.movesDescending,
              })
            }}
          >
            {this.state.movesDescending ? 'Descending' : 'Ascending'}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]]; 
    }
  }
  return null;
}

function indexToColRow(index) {
  return `(${index % 3}, ${Math.floor(index / 3)})`;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
