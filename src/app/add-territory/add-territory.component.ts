import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Polity } from '../models/polity';
import { Star } from '../models/star';

export interface AddTerritoryData {
  possibleOwners: Polity[];
  possibleStars: Star[];
}

@Component({
  selector: 'app-add-territory',
  templateUrl: './add-territory.component.html',
  styleUrls: ['./add-territory.component.scss']
})
export class AddTerritoryComponent implements OnInit {
  territory = {
    name: '',
    description: '',
    thumbnail: '',
    threadlink: '',
    owner: '',
    star: ''
  };
  politySearchTerm = '';
  starSearchTerm = '';
  constructor(
    public dialogRef: MatDialogRef<AddTerritoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddTerritoryData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  get isValid(): boolean {
    return this.territory.name.length > 0 &&
    this.territory.owner.length > 0 &&
    this.territory.star.length > 0;
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
