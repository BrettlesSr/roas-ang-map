import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-number-display',
  templateUrl: './number-display.component.html',
  styleUrls: ['./number-display.component.scss']
})
export class NumberDisplayComponent implements OnInit {

  constructor() { }

  @Input() iconSource: string;
  @Input() description: string;
  @Input() value: number;

  ngOnInit(): void {
  }
}
