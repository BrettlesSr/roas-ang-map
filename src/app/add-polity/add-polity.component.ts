import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PolityType } from '../enums/polityType';
import { Polity } from '../models/polity';
import { Star } from '../models/star';

export interface AddPolityData {
  possibleStars: Star[];
  possiblePolities: Polity[];
}

@Component({
  selector: 'app-add-polity',
  templateUrl: './add-polity.component.html',
  styleUrls: ['./add-polity.component.scss']
})
export class AddPolityComponent implements OnInit {
  polity = {
    name: '',
    description: '',
    thumbnail: '',
    threadlink: '',
    gdp: 0,
    type: PolityType.VergeState
  };
  star = '';
  members = [];
  types = [
    [PolityType.VergeState, 'Verge State'],
    [PolityType.UNTaskforce, 'UN Taskforce'],
    [PolityType.PMC, 'PMC'],
    [PolityType.Alien, 'Alien / Precursor Human'],
    [PolityType.SolGreatPower, 'Sol Great Power'],
    [PolityType.Supranational, 'Supranational']
  ];

  politySearchTerm = '';
  starSearchTerm = '';
  territorySearchTerm = '';

  constructor(
    public dialogRef: MatDialogRef<AddPolityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddPolityData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  get toMake(): any {
    return {
      polity: this.polity,
      star: this.star,
      members: this.members
    };
  }

  get isValid(): boolean {
    return this.polity.name.length > 0 &&
    this.polity.description.length > 0;
  }

  starSearchChanged(event): void {
    this.starSearchTerm = event.target.value;
  }

  isStarVisible(starName: string): boolean {
    return starName.toLowerCase().includes(this.starSearchTerm.toLowerCase());
  }

  politySearchChanged(event): void {
    this.politySearchTerm = event.target.value;
  }

  isPolityVisible(starName: string): boolean {
    return starName.toLowerCase().includes(this.politySearchTerm.toLowerCase());
  }
}
