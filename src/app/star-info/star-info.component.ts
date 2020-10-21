import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { History } from '../models/history';
import { Star } from '../models/star';

@Component({
  selector: 'app-star-info',
  templateUrl: './star-info.component.html',
  styleUrls: ['./star-info.component.scss']
})
export class StarInfoComponent implements OnInit {
  constructor(private db: AngularFireDatabase) {}

  @Input() starInfo: Star;
  history: History[] = [];

  ngOnInit(): void {
    this.db.list('/history').valueChanges().subscribe((h: History[]) => {
      this.history = h;
      }
    );
  }

  get orderedHistory(): History[]{
    return this.history.filter(h => h.location.name === this.starInfo.name)
    .sort((a, b) => a.date - b.date);
  }

  get nodes(): number[]{
    const nodes = [];
    for (let i = 0; i < (this.starInfo.nodesPresent * 1); i++) {
      nodes.push(i);
    }
    return nodes;
  }

  getHistoryDescriptor(title: string, date: number): string {
    const year = Math.floor(date);
    const yearString = year.toString();
    const withoutCommas = yearString.replace(',', '');
    return title + ' - ' + withoutCommas + ' ';
  }
}
