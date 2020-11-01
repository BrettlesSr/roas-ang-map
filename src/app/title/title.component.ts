import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { Option } from '../models/option';
import {MatDialog } from '@angular/material/dialog';
import { AddHistoryComponent } from '../add-history/add-history.component';
import { AddTerritoryComponent } from '../add-territory/add-territory.component';
import { AngularFireDatabase } from 'angularfire2/database';

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
    for (const star of this.parent.allStars) {
      const starOption = {
        value: star.name,
        starName: star.name,
        fullSearchText: star.name,
        order: 0
      };
      this.options.push(starOption);
      if (!star.territories) {
        continue;
      }
      for (const territory of star.territories) {
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
        possibleStars: this.parent.allStars.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0)
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
      const star = this.parent.allStars.filter(s => s.name === result.star)[0];
      const existingCount = star.territories === undefined ? 0 : star.territories.length;
      const key = this.db.database.ref().child('territories').push().key;
      const updates = {};
      updates['/territories/' + key] = result;
      updates['/stars/' + star.key + '/territories/' + existingCount] = result;
      this.db.database.ref().update(updates);
    });
  }
}
