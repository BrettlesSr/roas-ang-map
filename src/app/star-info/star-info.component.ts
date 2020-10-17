import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { History } from '../models/history';
import { Star } from '../models/star';

@Component({
  selector: 'app-star-info',
  templateUrl: './star-info.component.html',
  styleUrls: ['./star-info.component.scss']
})
export class StarInfoComponent {
  constructor(private db: AngularFireDatabase) {}
  @Input() starInfo: Star;


  get orderedHistory(): AngularFireList<History>{
    return this.db.list('/history', h => h.child('location').child('name').equalTo(this.starInfo.name));
  }

  getHistoryDescriptor(title: string, date: number): string {
    const year = Math.floor(date);
    const yearString = year.toString();
    const withoutCommas = yearString.replace(',', '');
    return title + ' - ' + withoutCommas + ' ';
  }
}
