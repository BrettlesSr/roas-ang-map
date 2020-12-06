import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { History } from '../models/history';
import { Star } from '../models/star';
import { Territory } from '../models/territory';

@Component({
  selector: 'app-star-info',
  templateUrl: './star-info.component.html',
  styleUrls: ['./star-info.component.scss']
})
export class StarInfoComponent implements OnInit {
  constructor(private db: AngularFireDatabase) {}

  @Input() starInfo: Star;
  history: History[] = [];
  territories: Territory[] = [];

  ngOnInit(): void {
    this.db.list('/history').valueChanges().subscribe((h: History[]) => {
      this.history = h;
      }
    );
    this.db.list('/territories').valueChanges().subscribe((territories: Territory[]) => {
      this.territories = territories;
      }
    );
  }

  get orderedHistory(): History[]{
    return this.history.filter(h => h.location === this.starInfo.name)
    .sort((a, b) => a.date - b.date);
  }

  get filteredTerritories(): Territory[] {
    return this.territories.filter(t => t.star === this.starInfo.name);
  }

  getHistoryDescriptor(title: string, date: number): string {
    const year = Math.floor(date);
    const yearString = year.toString();
    const withoutCommas = yearString.replace(',', '');
    return title + ' - ' + withoutCommas + ' ';
  }
}
