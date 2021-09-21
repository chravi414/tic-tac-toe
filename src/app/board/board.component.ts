import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input() gameSelected: any;
  @Input() isTeam: boolean = false;
  @Input() players: any[] = [];
  @Input() teams: any[] = [];
  @Input() winFactor: number = 0;
  @Output() homeEventTrigger = new EventEmitter();
  rows: any[] = [];
  columns: any[] = [];
  squares: any[][] = [];
  teamSymbols = ['X', 'O'];
  currentPlayerIndex = 0;
  currentTeamIndex = 0;
  currentTeamOnePlayerIndex = 0;
  currentTeamTwoPlayerIndex = 0;
  gameStopped: boolean = false;
  winner: string = '';
  maxSquaresCanBefilled: number = 0;
  minSquaresToBefilled: number = 0;
  squaresFilled: number = 0;
  isDraw: boolean = false;
  currentEditingPlayer: any = null;
  currentEditingTeam: any = null;
  updatedPlayerName: string = '';
  updatedPlayerSymbol: string = '';
  updatedTeam: any = {};
  symbolError: string = '';
  constructor() {}

  ngOnInit(): void {
    this.rows = Array(this.gameSelected.rows).fill('');
    this.columns = Array(this.gameSelected.columns).fill('');
    this.initializeSquares();
    this.maxSquaresCanBefilled = this.rows.length * this.columns.length;
    this.minSquaresToBefilled = this.winFactor * this.players.length;
  }

  initializeSquares() {
    for (let i = 0; i < this.rows.length; i++) {
      let cols = [];
      for (let j = 0; j < this.columns.length; j++) {
        cols.push('');
      }
      this.squares[i] = cols;
    }
  }

  makeMove(rowIndex: number, colIndex: number) {
    if (!this.gameStopped) {
      let squareRow = this.squares[rowIndex];
      if (!squareRow[colIndex]) {
        squareRow[colIndex] = this.isTeam
          ? this.teams[this.currentTeamIndex]
          : this.players[this.currentPlayerIndex];
        this.squares[rowIndex] = squareRow;
        this.maxSquaresCanBefilled--;
        if (this.maxSquaresCanBefilled >= 0) {
          this.checkWinnerAdvanced(rowIndex, colIndex);
        }
        if (this.maxSquaresCanBefilled === 0 && !this.winner) {
          this.announceDraw();
        }
      }
    }
  }

  changeTurn() {
    if (this.isTeam) {
      this.currentTeamIndex = this.currentTeamIndex === 0 ? 1 : 0;
      if (this.currentTeamIndex === 1) {
        this.currentTeamOnePlayerIndex =
          this.currentTeamOnePlayerIndex === 0 ? 1 : 0;
      }
      if (this.currentTeamIndex === 0) {
        this.currentTeamTwoPlayerIndex =
          this.currentTeamTwoPlayerIndex === 0 ? 1 : 0;
      }
    } else {
      this.currentPlayerIndex =
        this.currentPlayerIndex === this.players.length - 1
          ? 0
          : this.currentPlayerIndex + 1;
    }
  }

  playAgain() {
    this.initializeSquares();
    this.currentPlayerIndex = 0;
    this.currentTeamIndex = 0;
    this.currentTeamOnePlayerIndex = 0;
    this.currentTeamTwoPlayerIndex = 0;
    this.maxSquaresCanBefilled = this.rows.length * this.columns.length;
    this.isDraw = false;
    this.gameStopped = false;
    this.winner = '';
  }

  goToHome() {
    this.homeEventTrigger.emit(true);
  }

  checkWinnerAdvanced(rowIndex: number, colIndex: number) {
    let winner;

    winner =
      this.checkForRowsAdvanced(rowIndex, colIndex) ||
      this.checkForColAdvanced(rowIndex, colIndex);
    // ||
    // this.checkForDiagonalAdvanced(rowIndex, colIndex);
    // ||
    // this.checkForReverseDiagonalAdvanced(rowIndex, colIndex);
    // || this.checkForColumns() || this.checkForDiagonals();
    console.log(winner, 'winner is');
    if (winner) {
      // alert('success');
      const winnerTeamIndex = this.currentTeamIndex + 1;
      const winnerPlayer = this.players[this.currentPlayerIndex];
      this.winner = this.isTeam
        ? 'Team - ' + winnerTeamIndex
        : winnerPlayer.name + '(' + winnerPlayer.symbol + ')';
      this.stopGame();
    } else {
      this.changeTurn();
    }
  }

  checkForRowsAdvanced(rowIndex: number, colIndex: number) {
    const rowValues = this.squares[rowIndex];
    let leftCount = 1,
      rightCount = 1;
    for (let j = colIndex; j < this.columns.length; j++) {
      if (rowValues[j] === rowValues[j + 1]) {
        rightCount++;
        if (rightCount === this.winFactor) {
          return true;
        }
      } else {
        break;
      }
    }
    for (let j = colIndex; j >= 0; j--) {
      if (rowValues[j] === rowValues[j - 1]) {
        leftCount++;
        if (leftCount === this.winFactor) {
          return true;
        }
      } else {
        break;
      }
    }
    if (leftCount + rightCount - 1 === this.winFactor) {
      return true;
    }
    return null;
  }

  checkForColAdvanced(rowIndex: number, colIndex: number) {
    let colValues = [];
    for (let i = 0; i < this.rows.length; i++) {
      colValues.push(this.squares[i][colIndex]);
    }

    let leftCount = 1,
      rightCount = 1;
    for (let j = rowIndex; j < this.columns.length; j++) {
      if (colValues[j] === colValues[j + 1]) {
        rightCount++;
        if (rightCount === this.winFactor) {
          return true;
        }
      } else {
        break;
      }
    }
    for (let j = rowIndex; j >= 0; j--) {
      if (colValues[j] === colValues[j - 1]) {
        leftCount++;
        if (leftCount === this.winFactor) {
          return true;
        }
      } else {
        break;
      }
    }
    if (leftCount + rightCount - 1 === this.winFactor) {
      return true;
    }
    return null;
  }

  checkForDiagonalAdvanced(rowIndex: number, colIndex: number) {
    let leftCount = 1,
      rightCount = 1;
    let winner = false;
    for (
      let i = rowIndex, j = colIndex;
      i < this.rows.length, j < this.columns.length;
      i++, j++
    ) {
      if (this.squares[i][j] === this.squares[i + 1][j + 1]) {
        rightCount++;
        if (rightCount === this.winFactor) {
          winner = true;
          return winner;
        }
      } else {
        break;
      }
    }
    for (let i = rowIndex, j = colIndex; i > 0 && j > 0; i--, j--) {
      if (this.squares[i][j] === this.squares[i - 1][j - 1]) {
        leftCount++;
        if (leftCount === this.winFactor) {
          winner = true;
          return winner;
        }
      } else {
        break;
      }
    }
    if (leftCount + rightCount - 1 === this.winFactor) {
      return true;
    }
    return null;
  }

  // checkForReverseDiagonalAdvanced(rowIndex: number, colIndex: number) {
  //   let leftCount = 1,
  //     rightCount = 1;
  //   let winner = false;
  //   for (let i = rowIndex; i < this.rows.length; i++) {
  //     for (let j = colIndex; j >= 0; j--) {
  //       if (this.squares[i][j] === this.squares[i + 1][j + 1]) {
  //         rightCount++;
  //         if (rightCount === this.winFactor) {
  //           winner = true;
  //           return winner;
  //         }
  //       } else {
  //         break;
  //       }
  //     }
  //   }
  //   for (let i = rowIndex; i >= 0; i--) {
  //     for (let j = colIndex; j < this.columns.length; j++) {
  //       if (this.squares[i][j] === this.squares[i - 1][j - 1]) {
  //         leftCount++;
  //         if (leftCount === this.winFactor) {
  //           winner = true;
  //           return winner;
  //         }
  //       } else {
  //         break;
  //       }
  //     }
  //   }
  //   if (leftCount + rightCount - 1 === this.winFactor) {
  //     return true;
  //   }
  //   return null;
  // }

  checkWinner() {
    let winner;
    winner = this.checkForRows(); // || this.checkForColumns() || this.checkForDiagonals();
    console.log(winner, 'winner is');
    if (winner) {
      const winnerTeamIndex = this.currentTeamIndex + 1;
      this.winner = this.isTeam
        ? 'Team - ' + winnerTeamIndex
        : winner['name'] + '(' + winner['symbol'] + ')';
      this.stopGame();
    } else {
      this.changeTurn();
    }
  }

  checkForRows() {
    for (let i = 0; i < this.rows.length; i++) {
      let rowElements = this.squares[i];
      let rowSymbols = rowElements.map((el) => el.symbol);
      for (let j = 0; j < this.winFactor; j++) {
        const subRowValues = rowSymbols.slice(j, j + this.winFactor);
        if (this.checkForEquality(subRowValues)) {
          return rowElements[j];
        }
      }
    }
    return null;
  }

  checkForColumns() {
    for (let i = 0; i < this.rows.length; i++) {
      let colElements = this.squares.map((el) => el[i]);
      let colSymbols = colElements.map((el) => el.symbol);
      console.log(colSymbols);
      if (this.checkForEquality(colSymbols)) {
        return colElements[0];
      }
    }
    return null;
  }

  checkForDiagonals() {
    let diagonalElements = [];
    let reverseDiagonalElements = [];
    for (
      let i = 0, j = this.rows.length - 1;
      i < this.rows.length, j >= 0;
      i++, j--
    ) {
      diagonalElements.push(this.squares[i][i]);
      reverseDiagonalElements.push(this.squares[j][i]);
    }
    let diagonalSymbols = diagonalElements.map((el) => el.symbol);
    let revDiagonalSymbols = reverseDiagonalElements.map((el) => el.symbol);
    if (this.checkForEquality(diagonalSymbols)) {
      return diagonalElements[0];
    }

    if (this.checkForEquality(revDiagonalSymbols)) {
      return reverseDiagonalElements[0];
    }
    return null;
  }

  checkForEquality(valuesArr: any[]) {
    const set = new Set(valuesArr);
    const values = set.values();
    return (
      set.size === 1 &&
      values.next().value !== '' &&
      values.next().value !== undefined
    );
  }

  announceDraw() {
    this.gameStopped = true;
    this.isDraw = true;
  }

  stopGame() {
    this.gameStopped = true;
  }

  fadeOutSquares() {}

  onEditClick(player: any) {
    this.currentEditingPlayer = player;
    this.updatedPlayerName = player.name;
    this.updatedPlayerSymbol = player.symbol;
  }

  updatePlayerDetails() {
    if (!this.symbolError) {
      const playerIndex = this.players.findIndex(
        (player) => player.id === this.currentEditingPlayer.id
      );
      if (playerIndex >= 0) {
        const playerUpdated = {
          id: this.currentEditingPlayer.id,
          name: this.updatedPlayerName,
          symbol: this.updatedPlayerSymbol,
        };
        this.players[playerIndex] = playerUpdated;
      }
      this.updateBoard();
      this.cancelEditMode();
    }
  }

  cancelEditMode() {
    this.currentEditingPlayer = null;
  }

  updateBoard() {
    const lookupId = this.isTeam
      ? this.currentEditingTeam.id
      : this.currentEditingPlayer.id;
    const updatedSymbol = this.isTeam
      ? this.updatedTeam['symbol']
      : this.updatedPlayerSymbol;
    for (let i = 0; i < this.squares.length; i++) {
      this.squares[i]
        .filter((el) => el.id === lookupId)
        .map((el) => (el.symbol = updatedSymbol));
    }
  }

  onEditTeam(team: any) {
    this.currentEditingTeam = team;
    this.updatedTeam = {
      id: team.id,
      symbol: team.symbol,
      players: [...team.players],
    };
    console.log(this.updatedTeam);
  }

  updateTeamDetails() {
    if (!this.symbolError) {
      this.teams[this.updatedTeam.id - 1] = { ...this.updatedTeam };
      this.updateBoard();
      this.cancelTeamEditMode();
    }
  }

  cancelTeamEditMode() {
    this.currentEditingTeam = null;
    this.symbolError = '';
  }

  changeSymbol(event: any, isTeam: boolean) {
    if (event.target.value === '' || event.target.value.length > 1) {
      this.symbolError = 'Symbol should of one character and not a space';
    } else {
      this.symbolError = '';
      if (isTeam) {
        this.updatedTeam['symbol'] = event.target.value;
      } else {
        this.updatedPlayerSymbol = event.target.value;
      }
    }
  }
}
