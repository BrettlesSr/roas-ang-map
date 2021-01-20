import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import { AddPolityToHistoryComponent } from '../add-polity-to-history/add-polity-to-history.component';
import { AppComponent } from '../app.component';
import { History } from '../models/history';
import { Star } from '../models/star';
import { Territory } from '../models/territory';

@Component({
  selector: 'app-star-info',
  templateUrl: './star-info.component.html',
  styleUrls: ['./star-info.component.scss']
})
export class StarInfoComponent implements OnInit {
  constructor(public dialog: MatDialog, private db: AngularFireDatabase) {}

  @Input() starInfo: Star;
  @Input() parent: AppComponent;
  history: History[] = [];
  territories: Territory[] = [];

  ngOnInit(): void {
    this.db.list('/history').valueChanges().subscribe((h: History[]) => {
      this.history = h;
      this.db.list('/history')
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => a.key))
      )
      .subscribe(k => {
        for (let i = 0; i < k.length; i++) {
          this.history[i].key = k[i];
        }      
      });
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

  shortened(input: string, count: number): string {
    if (input.length < count) {
      return input;
    } else {
      return input.substring(0, count) + "...";
    }
  }

  openPolity(polity: string) {
    this.parent.openPolity(polity);
  }

  openAddPolityToHistoryModal(history: History): void {
    const dialogRef = this.dialog.open(AddPolityToHistoryComponent, {
      width: '600px',
      data: {
        possiblePolities: this.parent.allPolities.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0),
        history: history
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      const key = result.key;
      const updates = {};
      updates['/history/'+ key] = result;
      this.db.database.ref().update(updates);
    });
  }
}
