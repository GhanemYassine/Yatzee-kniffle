import { Component, OnChanges, SimpleChanges } from '@angular/core'

export interface IDiceState {
  face: number;
  canMove: boolean;
}

const MAXIMUM_ROLLS = 2;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  diceState: IDiceState[];
  allowedRolls = MAXIMUM_ROLLS;
  title = 'yatzee';

  constructor() {
    this.diceState = Array(5)
      .fill(1)
      .map(() => ({
        face: Math.ceil(Math.random() * 6),
        canMove: true,
      }));
  }

  fireReroll(shouldResetRolls: boolean) {
    if (shouldResetRolls) {
      this.allowedRolls = MAXIMUM_ROLLS;
      this.diceState.forEach((dice) => {
        dice.canMove = true;
      });
    } else {
      this.allowedRolls--;
    }
    for (let index = 0; index < this.diceState.length; index++) {
      if (this.diceState[index].canMove) {
        this.diceState[index].face = Math.ceil(Math.random() * 6);
      }
    }
    this.diceState = [...this.diceState];
  }
}
