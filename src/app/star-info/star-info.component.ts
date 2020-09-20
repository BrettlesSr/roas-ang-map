import { Component, Input, OnInit } from '@angular/core';
import { HistoryFactoid } from '../models/historyFactoid';
import { StarInfo } from '../models/starInfo';

@Component({
  selector: 'app-star-info',
  templateUrl: './star-info.component.html',
  styleUrls: ['./star-info.component.scss']
})
export class StarInfoComponent implements OnInit {

  @Input() starInfo: StarInfo;

  orderedHistory: HistoryFactoid[];

  constructor() { }

  ngOnInit(): void {
    if (!this.starInfo){
      return;
    }
    this.orderedHistory = this.starInfo.history.sort((a, b) => a.date - b.date);
  }
}
