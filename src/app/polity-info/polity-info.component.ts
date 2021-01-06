import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Polity } from '../models/polity';
import { Territory } from '../models/territory';
import { History } from '../models/history';
import { AppComponent } from '../app.component';
import { PolityType } from '../enums/polityType';
import { AddPolityToHistoryComponent } from '../add-polity-to-history/add-polity-to-history.component';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-polity-info',
  templateUrl: './polity-info.component.html',
  styleUrls: ['./polity-info.component.scss']
})
export class PolityInfoComponent implements OnInit {
  constructor(public dialog: MatDialog, private db: AngularFireDatabase) {}

  @Input() polityInfo: Polity;
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
    return this.history.filter(h => h.politiesInvolved && h.politiesInvolved.includes(this.polityInfo.name))
    .sort((a, b) => a.date - b.date);
  }

  get filteredTerritories(): Territory[] {
    return this.territories.filter(t => t.owner === this.polityInfo.name);
  }

  get stateType(): string {
    switch (this.polityInfo.type) {
      case PolityType.VergeState:
        return "State";
      case PolityType.PMC:
        return "PMC";
      case PolityType.UNTaskforce:
        return "Taskforce";
      case PolityType.SolGreatPower:
        return "State";
      default:
        return "Polity";
    }
  }
  
  getTerritoryDescriptor(territory: Territory): string {
    const article = this.polityInfo.name.toLowerCase().startsWith('the') ? '' : 'the ';
    if (territory.description == this.polityInfo.description) {
      switch (this.polityInfo.type) {
        case PolityType.VergeState:
        case PolityType.SolGreatPower:
          return `Capital of ${ article }${ this.polityInfo.name }, located within the ${ territory.star } system.`;
        case PolityType.PMC:
        case PolityType.UNTaskforce:
          return `Operating base of ${ article }${ this.polityInfo.name }, hosted within the ${ territory.star } system.`;
        default:
          return `Capital of ${ article }${ this.polityInfo.name }, located within the ${ territory.star } system.`;
      }      
    } else if (territory.description.length === 0) {
      return `Located within the system ${ territory.star }.`;
    } else {
      return territory.description;
    }
  }

  openPolity(polity: string) {
    this.parent.openPolity(polity);
  }

  openStar(star: string) {
    this.parent.openStar(star);
  }

  getHistoryDescriptor(title: string, date: number): string {
    const year = Math.floor(date);
    const yearString = year.toString();
    const withoutCommas = yearString.replace(',', '');
    return title + ' - ' + withoutCommas + ' ';
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