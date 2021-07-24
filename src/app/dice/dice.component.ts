import { Component, Input, OnInit } from '@angular/core'

import { IDiceState } from '../app.component'

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.css'],
})
export class DiceComponent implements OnInit {
  @Input() diceState: IDiceState[] = [];

  constructor() {}
  // collection of dice
  // onRerrol(){}
  ngOnInit(): void {}

  selectDice(dieState: IDiceState): void {
    dieState.canMove = !dieState.canMove;
  }
}
