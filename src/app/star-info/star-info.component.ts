import { Component, Input, OnInit } from '@angular/core';
import { HistoryFactoid } from '../models/historyFactoid';
import { StarInfo } from '../models/starInfo';

@Component({
  selector: 'app-star-info',
  templateUrl: './star-info.component.html',
  styleUrls: ['./star-info.component.scss']
})
export class StarInfoComponent {

  @Input() starInfo: StarInfo;

  constructor() { }

  get orderedHistory(): HistoryFactoid[]{
    return this.starInfo.history.sort((a, b) => a.date - b.date);
  }

  getHistoryDescriptor(title: string, date: number): string {
    const year = Math.floor(date);
    const yearString = year.toString();
    const withoutCommas = yearString.replace(',', '');
    return title + ' - ' + withoutCommas + ' ';
  }
}
