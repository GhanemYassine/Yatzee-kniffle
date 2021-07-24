import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'

import { IDiceState } from '../app.component'
import { SCORE_DESIGN } from './score-design'

export interface ScoreColumn {
  name: string;
  finalScore: number;
  roundPossibleScore: number;
  selectable: boolean;
}

@Component({
  selector: 'app-score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.css'],
})
export class ScoreTableComponent implements OnInit, OnChanges {
  constructor() {}
  @Input() diceState: IDiceState[] = [];
  @Input() rerollDices: (shouldResetRolls: boolean) => void = () => {};

  scoreRows: ScoreColumn[] = SCORE_DESIGN;
  displayedColumns: string[] = [
    'name',
    'finalScore',
    'roundPossibleScore',
    'selectable',
  ];

  ngOnInit(): void {}

  ngOnChanges() {
    this.calculateScore();
  }

  calculateScore() {
    this.calculate('Aces', 1);
    this.calculate('Twos', 2);
    this.calculate('Threes', 3);
    this.calculate('Fours', 4);
    this.calculate('Fives', 5);
    this.calculate('Sixes', 6);
    this.calculateOfAKind('3 of a kind');
    this.calculateOfAKind('4 of a kind');
    this.calculateStraight('Sm. Straight');
    this.calculateStraight('Lg. Straight');
    this.calculateFullHouse('Full House');
  }

  calculate(name: string, face: number) {
    const row = this.scoreRows.find((score) => score.name === name);
    if (row) {
      this.countFrequency(row, face);
    }
  }

  calculateOfAKind(name: string): void {
    const row = this.scoreRows.find((score) => score.name === name);
    const MINIMUM_FREQUENCY = parseInt(name[0]);
    let valid = false;
    let score = 0;
    for (const face of [1, 2, 3, 4, 5, 6]) {
      if (
        this.diceState.filter((dice) => dice.face === face).length >=
        MINIMUM_FREQUENCY
      ) {
        valid = true;
      }
    }
    if (valid) {
      this.diceState.forEach((dice) => {
        score += dice.face;
      });
    }
    if (row) {
      row.roundPossibleScore = score;
    }
  }

  calculateStraight(name: string): void {
    const row = this.scoreRows.find((row) => row.name === name);
    const dices = this.diceState.map((dice) => dice.face).sort();
    const SEEKED_SEQUENCE_LENGTH = name === 'Sm. Straight' ? 4 : 5;
    let notInASequenceDice = 0;
    for (let i = 1; i < dices.length; i++) {
      if (dices[i] !== dices[i - 1] + 1) {
        notInASequenceDice++;
      }
    }
    const squenceLength = 5 - notInASequenceDice;
    if (row) {
      let score = 0;
      if (squenceLength >= SEEKED_SEQUENCE_LENGTH) {
        score = SEEKED_SEQUENCE_LENGTH === 4 ? 30 : 40;
      }
      row.roundPossibleScore = score;
    }
  }

  calculateFullHouse(name: string) {
    const row = this.scoreRows.find((row) => row.name === name);
    let twos = false;
    let threes = false;
    for (let face of [1, 2, 3, 4, 5, 6]) {
      const frequency = this.diceState.filter((dice) => dice.face === face)
        .length;
      if (frequency === 2) twos = true;
      else if (frequency === 3) threes = true;
    }
    if (row) row.roundPossibleScore = twos && threes ? 50 : 0;
  }

  submitScore(row: ScoreColumn) {
    row.finalScore += row.roundPossibleScore;
    row.selectable = false;
    this.rerollDices(true);
  }

  countFrequency(row: ScoreColumn, face: number): void {
    row.roundPossibleScore =
      this.diceState.filter((dice) => dice.face === face).length * face;
  }
}
