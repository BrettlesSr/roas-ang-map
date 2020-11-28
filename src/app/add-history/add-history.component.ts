import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Polity } from '../models/polity';
import { Star } from '../models/star';
import { Territory } from '../models/territory';

export interface AddHistoryData {
  possiblePolities: Polity[];
  possibleStars: Star[];
  possibleTerritories: Territory[];
}

@Component({
  selector: 'app-add-history',
  templateUrl: './add-history.component.html',
  styleUrls: ['./add-history.component.scss']
})
export class AddHistoryComponent implements OnInit {
  history = {
    name: '',
    date: 0,
    description: '',
    thumbnail: '',
    threadlink: '',
    location: null,
    territoriesInvolved: [],
    politiesInvolved: []
  };
  minDate = new Date(Date.UTC(2747, 0));
  maxDate = new Date(Date.UTC(2800, 0));
  politySearchTerm = '';
  starSearchTerm = '';
  territorySearchTerm = '';
  constructor(
    public dialogRef: MatDialogRef<AddHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddHistoryData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  get isValid(): boolean {
    return this.history.name.length > 0 &&
    this.history.description.length > 0 &&
    this.history.location !== null &&
    this.history.date > 0;
  }

  get possibleTerritories(): Territory[] {
    if (this.history.location === null || this.data.possibleTerritories === undefined) {
      return [];
    }
    return this.data.possibleTerritories.filter(t => t.star === this.history.location);
  }

  dateChanged(event): void {
    const date = event.value;
    const pDate = new Date(date);
    const year = pDate.getFullYear() + ((pDate.getMonth()) / 12) + ((pDate.getDay() / 31) * 0.01);
    this.history.date = year;
  }

  starSearchChanged(event): void {
    this.starSearchTerm = event.target.value;
  }

  isStarVisible(starName: string): boolean {
    return starName.toLowerCase().includes(this.starSearchTerm.toLowerCase());
  }

  territorySearchChanged(event): void {
    this.territorySearchTerm = event.target.value;
  }

  isTerritoryVisible(starName: string): boolean {
    return starName.toLowerCase().includes(this.territorySearchTerm.toLowerCase());
  }

  politySearchChanged(event): void {
    this.politySearchTerm = event.target.value;
  }

  isPolityVisible(starName: string): boolean {
    return starName.toLowerCase().includes(this.politySearchTerm.toLowerCase());
  }
}
