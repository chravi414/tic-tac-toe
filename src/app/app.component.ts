import { Component } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tic-tac-toe-advanced';
  gameType: number = 0;
  gameTypes: any = [
    {
      id: 1,
      label: '3 X 3',
      rows: 3,
      columns: 3,
    },
    {
      id: 2,
      label: '5 X 5',
      rows: 5,
      columns: 5,
    },
  ];
  gameSelected: any;
  playerForm: FormGroup;
  teamForm: FormGroup;
  isGameStarted: boolean = false;
  isTeam: boolean = false;
  players: any[] = [];
  teams: any[] = [];
  playType: any;
  playerDefaultSymbols: any = [];
  playTypes: any[] = [
    {
      id: 1,
      value: 'Free Play',
    },
    {
      id: 2,
      value: 'Team',
    },
  ];
  noOfPlayersArray: number[] = [];
  noOfPlayers: number = 0;
  winFactor: number = 0;
  winFactorArray: number[] = [];
  showTeamForm: boolean = false;
  showFreePlayForm: boolean = false;

  constructor(private fb: FormBuilder) {
    this.playerForm = this.fb.group({
      players: this.fb.array([]),
    });
    this.teamForm = this.fb.group({
      team1: this.fb.group({
        player1: [null, Validators.required],
        player2: ['', Validators.required],
      }),
      team2: this.fb.group({
        player1: [null, Validators.required],
        player2: ['', Validators.required],
      }),
    });
  }

  get playersArray(): FormArray {
    return this.playerForm.get('players') as FormArray;
  }

  newPlayer(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
    });
  }

  addPlayer() {
    this.playersArray.push(this.newPlayer());
  }

  onPlayTypeSelect(playType: any) {
    this.gameSelected = playType.id === 2 ? this.gameTypes[1] : null;
    this.gameType = playType.id === 2 ? 2 : 0;
    this.showTeamForm = playType.id === 2 ? true : false;
    this.showFreePlayForm = playType.id === 1 ? true : false;
    if (this.gameType === 2) {
      this.onGameTypeSelect(this.gameSelected);
    } else {
      this.winFactor = 0;
      this.noOfPlayers = 0;
      this.noOfPlayersArray = [];
      this.winFactorArray = [];
    }
    this.noOfPlayers = playType.id === 2 ? 4 : this.noOfPlayers;
    this.isTeam = playType.id === 2 ? true : false;
    this.playerDefaultSymbols = this.isTeam
      ? ['X', 'O']
      : this.playerDefaultSymbols;
  }

  onGameTypeSelect(gameType: any) {
    this.noOfPlayers = 0;
    this.winFactor = 0;
    this.gameSelected = gameType;
    if (gameType.id === 1) {
      this.noOfPlayersArray = [2];
      this.winFactorArray = [3];
    } else {
      this.noOfPlayersArray = [2, 3, 4];
      this.winFactorArray = [3, 4, 5];
    }
  }

  onNoOfPlayersSelect() {
    this.playersArray.clear();
    for (let i = 0; i < this.noOfPlayers; i++) {
      this.addPlayer();
    }
    if (this.noOfPlayers === 2) {
      this.playerDefaultSymbols = ['X', 'O'];
    } else if (this.noOfPlayers === 3) {
      this.playerDefaultSymbols = ['A', 'B', 'C'];
    } else {
      this.playerDefaultSymbols = ['A', 'B', 'C', 'D'];
    }
  }

  playGame() {
    this.gameSelected = this.gameTypes.find(
      (game: { id: number }) => game.id === this.gameType
    );
    this.isTeam = this.gameType === 2 ? true : false;
    if (!this.isTeam) {
      this.players.push(
        this.playerForm.value.player1,
        this.playerForm.value.player2
      );
    } else {
      const teamFormValue = this.teamForm.value;
      Object.keys(teamFormValue).forEach((key) => {
        const team = teamFormValue[key];
        this.players.push(team.player1, team.player2);
      });
    }
    this.isGameStarted = true;
  }

  playGameAdvanced() {
    this.players = [];
    this.teams = [];
    console.log(this.teamForm.value);
    if (!this.isTeam) {
      const playerFormValue = this.playerForm.value['players'];
      Object.keys(playerFormValue).forEach((key, index) => {
        const playerObj = {
          id: index + 1,
          name: playerFormValue[key].name,
          symbol: this.playerDefaultSymbols[index],
        };
        this.players.push(playerObj);
      });
    } else {
      const teamFormValue = this.teamForm.value;
      Object.keys(teamFormValue).forEach((key, index) => {
        const team = teamFormValue[key];
        const teamObj = {
          id: index + 1,
          symbol: this.playerDefaultSymbols[index],
          players: [
            {
              id: 1,
              name: team.player1,
            },
            {
              id: 2,
              name: team.player2,
            },
          ],
        };
        this.teams.push(teamObj);
      });
    }
    console.log(this.teams);
    this.isGameStarted = true;
  }

  restartAll(status: any) {
    if (status) {
      this.teamForm.reset();
      this.playerForm.reset();
      this.gameType = 0;
      this.gameSelected = null;
      this.isGameStarted = false;
      this.isTeam = false;
      this.players = [];
      this.noOfPlayers = 0;
      this.playType = null;
      this.noOfPlayersArray = [];
      this.winFactor = 0;
      this.winFactorArray = [];
      this.showTeamForm = false;
      this.showFreePlayForm = false;
      this.playerDefaultSymbols = [];
    }
  }
}
