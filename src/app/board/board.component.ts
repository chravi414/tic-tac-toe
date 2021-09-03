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
  @Input() teamMembers: any[] = [];
  @Output() homeEventTrigger = new EventEmitter();
  rows: any[] = [];
  columns: any[] = [];
  squares: any[][] = [];
  playerSymbols = ['X', 'O'];
  teamSymbols = ['X', 'O'];
  currentPlayerIndex = 0;
  currentTeamIndex = 0;
  currentTeamOnePlayerIndex = 0;
  currentTeamTwoPlayerIndex = 0;
  gameStopped: boolean = false;
  winner: string = '';
  maxSquaresCanBefilled: number = 0;
  isDraw: boolean = false;
  constructor() {}

  ngOnInit(): void {
    this.rows = Array(this.gameSelected.rows).fill('');
    this.columns = Array(this.gameSelected.columns).fill('');
    this.initializeSquares();
    this.maxSquaresCanBefilled = this.rows.length * this.columns.length;
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
          ? this.teamSymbols[this.currentTeamIndex]
          : this.playerSymbols[this.currentPlayerIndex];
        this.squares[rowIndex] = squareRow;
        this.maxSquaresCanBefilled--;
        if (this.maxSquaresCanBefilled > 0) {
          this.checkWinner();
        } else {
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
      this.currentPlayerIndex = this.currentPlayerIndex === 0 ? 1 : 0;
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

  checkWinner() {
    let winner = '';
    winner =
      this.checkForRows() || this.checkForColumns() || this.checkForDiagonals();
    if (winner) {
      const winnerTeamIndex = this.currentTeamIndex + 1;
      this.winner = this.isTeam
        ? 'Team - ' + winnerTeamIndex
        : this.players[this.currentPlayerIndex];
      this.stopGame();
    } else {
      this.changeTurn();
    }
  }

  checkForRows() {
    for (let i = 0; i < this.rows.length; i++) {
      let rowElements = this.squares[i];
      if (this.checkForEquality(rowElements)) {
        return rowElements[0];
      }
    }
    return null;
  }

  checkForColumns() {
    for (let i = 0; i < this.rows.length; i++) {
      let colElements = this.squares.map((el) => el[i]);
      console.log(colElements);
      if (this.checkForEquality(colElements)) {
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
    if (this.checkForEquality(diagonalElements)) {
      return diagonalElements[0];
    }

    if (this.checkForEquality(reverseDiagonalElements)) {
      return reverseDiagonalElements[0];
    }
    return null;
  }

  checkForEquality(valuesArr: any[]) {
    const set = new Set(valuesArr);
    const values = set.values();
    return set.size === 1 && values.next().value !== '';
  }

  announceDraw() {
    this.gameStopped = true;
    this.isDraw = true;
  }

  stopGame() {
    this.gameStopped = true;
  }

  fadeOutSquares() {}
}
