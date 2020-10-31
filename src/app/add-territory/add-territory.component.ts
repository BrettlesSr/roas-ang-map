import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Polity } from '../models/polity';
import { Star } from '../models/star';
import { Territory } from '../models/territory';

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
  territory: Territory = {
    name: '',
    description: '',
    thumbnail: '',
    threadlink: '',
    owner: '',
    star: ''
  };
  constructor(
    public dialogRef: MatDialogRef<AddTerritoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddTerritoryData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
}
