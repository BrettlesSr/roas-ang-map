import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Polity } from '../models/polity';
import { Territory } from '../models/territory';
import { History } from '../models/history';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-polity-info',
  templateUrl: './polity-info.component.html',
  styleUrls: ['./polity-info.component.scss']
})
export class PolityInfoComponent implements OnInit {
  constructor(private db: AngularFireDatabase) {}

  @Input() polityInfo: Polity;
  @Input() parent: AppComponent;
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
    return this.history.filter(h => h.politiesInvolved.includes(this.polityInfo.name))
    .sort((a, b) => a.date - b.date);
  }

  get filteredTerritories(): Territory[] {
    return this.territories.filter(t => t.owner === this.polityInfo.name);
  }
  
  getTerritoryDescriptor(territory: Territory) {
    if (territory.description == this.polityInfo.description) {
      return `Capital of the ${ this.polityInfo.name }, located within the system ${ territory.star }.`;
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
}