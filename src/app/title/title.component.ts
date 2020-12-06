import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { Option } from '../models/option';
import {MatDialog } from '@angular/material/dialog';
import { AddHistoryComponent } from '../add-history/add-history.component';
import { AddTerritoryComponent } from '../add-territory/add-territory.component';
import { AddStarComponent } from '../add-star/add-star.component';
import { AngularFireDatabase } from 'angularfire2/database';
import { AddPolityComponent } from '../add-polity/add-polity.component';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  @Input() parent: AppComponent;
  searchFormControl = new FormControl('', []);
  options: Option[] = [];
  filteredOptions: Observable<Option[]>;
  showAutoComplete = false;
  showClear = false;
  constructor(public dialog: MatDialog, private db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.filteredOptions = this.searchFormControl.valueChanges
      .pipe(
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): Option[] {
    return this.options
    .filter(option => option.fullSearchText.toLowerCase().includes(value.toLowerCase()))
    .sort((a, b) => a.order - b.order);
  }

  updatedVal(e): void {
    if (e && e.length >= 3) {
       this.showAutoComplete = true;
    } else {
       this.showAutoComplete = false;
    }
    if (e && e.length > 0){
      this.showClear = true;
    } else{
      this.showClear = false;
    }
  }

  optionClicked(option: Option): void {
    this.parent.scrollToStar(option.starName);
    this.showAutoComplete = false;
  }

  clear(): void {
    this.searchFormControl.setValue('');
  }

  buildOptions(): void {
    if (this.parent.allTerritories === undefined ||
        this.parent.allStars === undefined) {
        return;
    }
    for (const star of this.parent.allStars) {
      const starOption = {
        value: star.name,
        starName: star.name,
        fullSearchText: star.name,
        order: 0
      };
      this.options.push(starOption);
      if (!this.parent.allTerritories) {
        continue;
      }
      const territories = this.parent.allTerritories.filter(t => t.star === star.name);
      for (const territory of territories) {
        const polityOption = {
        value: star.name + ' - ' + territory.name,
        starName: star.name,
        fullSearchText: star.name + territory.name + territory.description,
        order: 1
        };
        this.options.push(polityOption);
      }
    }
  }

  openAddHistory(): void {
    const dialogRef = this.dialog.open(AddHistoryComponent, {
      width: '600px',
      data: {
        possiblePolities: this.parent.allPolities.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0),
        possibleStars: this.parent.allStars.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0),
        possibleTerritories: this.parent.allTerritories.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0)
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      this.db.list('/history').push(result);
    });
  }

  openAddTerritory(): void {
    const dialogRef = this.dialog.open(AddTerritoryComponent, {
      width: '600px',
      data: {
        possibleOwners: this.parent.allPolities.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0),
        possibleStars: this.parent.allStars.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      const key = this.db.database.ref().child('territories').push().key;
      const updates = {};
      updates['/territories/' + key] = result;
      this.db.database.ref().update(updates);
    });
  }

  openAddPolity(): void {
    const dialogRef = this.dialog.open(AddPolityComponent, {
      width: '600px',
      data: {
        possibleStars: this.parent.allStars.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      const key1 = this.db.database.ref().child('polities').push().key;
      const updates = {};
      updates['/polities/' + key1] = result.polity;
      const key2 = this.db.database.ref().child('territories').push().key;
      updates['/territories/' + key2] = {
        name: result.polity.name,
        description: result.polity.description,
        thumbnail: result.polity.thumbnail,
        threadlink: result.polity.threadlink,
        owner: result.polity.name,
        star: result.star
      };
      this.db.database.ref().update(updates);
    });
  }

  openAddStar(): void {
    const dialogRef = this.dialog.open(AddStarComponent, {
      width: '600px',
      data: {
        possibleStars: this.parent.allStars.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      const lanes = result.lanes;
      result.lanes = null;
      const updates = {};
      const keyStar = this.db.database.ref().child('stars').push().key;
      updates['/stars/' + keyStar] = result;

      for (const lane of lanes) {
        const keyLane = this.db.database.ref().child('lanes').push().key;
        updates['/lanes/' + keyLane] = {
          starA: result.name,
          starB: lane
        };
      }

      this.db.database.ref().update(updates);
    });
  }
}
