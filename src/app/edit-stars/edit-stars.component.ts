import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireDatabase } from 'angularfire2/database';
import { Star } from '../models/star';

export interface EditStarsData{
  allStars: Star[];
}

@Component({
  selector: 'app-edit-stars',
  templateUrl: './edit-stars.component.html',
  styleUrls: ['./edit-stars.component.scss']
})
export class EditStarsComponent implements OnInit {
  star: Star;
  changes = {};
  index = 0;
  constructor(
    public dialogRef: MatDialogRef<EditStarsData>,
    @Inject(MAT_DIALOG_DATA) public data: EditStarsData,
    private db: AngularFireDatabase
  )
  {
    this.star = this.data.allStars[this.index];
  }

  codeChanged(event): void {
    const code = event.target.value.split("\"");
    const hitbox = code[15].split(',');
    const point = code[27].split(',');
    this.changes['/stars/'+ this.star.key] = {
      x : point[0],
      y: point[1],
      xStart: hitbox[0],
      yStart: hitbox[1],
      xEnd: hitbox[2],
      yEnd: hitbox[3],
      nodesPresent: this.star.nodesPresent,
      name: this.star.name,
      thumbnail: this.star.thumbnail
    }
  }

  next(): void {
    this.db.database.ref().update(this.changes);
    this.changes = {};
    this.index++;
    this.star = this.data.allStars[this.index];
  }

  close(): void {
    this.db.database.ref().update(this.changes);
    this.changes = {};
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
}
