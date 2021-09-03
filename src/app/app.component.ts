import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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
  showPlayerDetails: boolean = true;
  isTeam: boolean = false;
  players: string[] = [];

  constructor(private fb: FormBuilder) {
    this.playerForm = this.fb.group({
      player1: [null, Validators.required],
      player2: ['', Validators.required],
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

  playGame() {
    console.log(this.teamForm.value);
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
    console.log(this.players);
    this.showPlayerDetails = false;
  }

  restartAll(status: any) {
    if (status) {
      this.teamForm.reset();
      this.playerForm.reset();
      this.gameType = 0;
      this.gameSelected = null;
      this.showPlayerDetails = true;
      this.isTeam = false;
      this.players = [];
    }
  }
}
