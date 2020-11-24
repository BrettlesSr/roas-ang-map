import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Star } from '../models/star';

export interface AddStarData {
  possibleStars: Star[];
}

@Component({
  selector: 'app-add-star',
  templateUrl: './add-star.component.html',
  styleUrls: ['./add-star.component.scss']
})
export class AddStarComponent implements OnInit {
  star = {
    name: '',
    thumbnail: '',
    xStart: 0,
    yStart: 0,
    xEnd: 0,
    yEnd: 0,
    x: 0,
    y: 0,
    nodesPresent: 0,
    lanes: []
  };
  filteredStars: Star[];
  constructor(
    public dialogRef: MatDialogRef<AddStarData>,
    @Inject(MAT_DIALOG_DATA) public data: AddStarData
  )
  {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.filteredStars = this.data.possibleStars;
  }

  hitboxChanged(event): void {
    const numbers = event.target.value.split(',');
    this.star.xStart = numbers[0];
    this.star.yStart = numbers[1];
    this.star.xEnd = numbers[2];
    this.star.yEnd = numbers[3];
  }

  pointChanged(event): void {
    const numbers = event.target.value.split(',');
    this.star.x = numbers[0];
    this.star.y = numbers[1];
  }

  starSearchChanged(event): void {
    this.filteredStars = this._filter(event.target.value);
  }

  private _filter(value: string): Star[] {
    return this.data.possibleStars
    .filter(star => star.name.toLowerCase().includes(value.toLowerCase()));
  }
}
