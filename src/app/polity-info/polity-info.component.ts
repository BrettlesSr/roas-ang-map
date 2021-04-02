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
import { Relationship } from '../models/relationship';
import { Group } from '../models/group';

export interface RelationGroup{
  type: string;
  descriptor: string;
  relations: string[];
}

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
  orderedHistory: History[] = [];

  territories: Territory[] = [];
  filteredTerritories: Territory[] = [];

  relationships: Relationship[] = [];
  groups: Group[] = [];
  groupedRelations: RelationGroup[] = [];

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
        this.orderedHistory = this.getOrderedHistory();
      });
      }
    );
    this.db.list('/territories').valueChanges().subscribe((territories: Territory[]) => {
      this.territories = territories;
      this.filteredTerritories = this.getFilteredTerritories();
      }
    );
    this.db.list('/relationships').valueChanges().subscribe((relationships: Relationship[]) => {
      this.relationships = relationships;
      this.groupedRelations = this.getGroupedRelations();
      }
    );
    this.db.list('/groups').valueChanges().subscribe((groups: Group[]) => {
      this.groups = groups;
      this.groupedRelations = this.getGroupedRelations();
      }
    );
  }

  getOrderedHistory(): History[]{
    return this.history.filter(h => h.politiesInvolved && h.politiesInvolved.includes(this.polityInfo.name))
    .sort((a, b) => a.date - b.date);
  }

  getFilteredTerritories(): Territory[] {
    return this.territories.filter(t => t.owner === this.polityInfo.name);
  }

  getGroupedRelations(): RelationGroup[] {
    const output = [];
    if (this.relationships.length === 0 || this.groups.length === 0) {
      return output;
    }
    for (const relationship of this.relationships) {
      if (relationship.APolity === this.polityInfo.name || relationship.BPolity === this.polityInfo.name) {
        const other = relationship.APolity === this.polityInfo.name ? relationship.BPolity : relationship.APolity;
        const existingGroup = output.find(o => o.type === relationship.groupType);
        if (existingGroup === undefined) {
          const group = this.groups.find(g => g.type === relationship.groupType);
          const descriptor = relationship.APolity === this.polityInfo.name ? group.ABDescriptor : group.BADescriptor;
          output.push({
            type: relationship.groupType,
            descriptor,
            relations: [ other ]
          });
        }
        else {
          existingGroup.relations.push(other);
        }
      }
    }
    return output;
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
    if (territory.description === this.polityInfo.description) {
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
