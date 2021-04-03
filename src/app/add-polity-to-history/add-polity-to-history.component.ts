import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Polity } from '../models/polity';
import { History } from '../models/history';

export interface AddPolityToHistoryData {
  history: History;
  possiblePolities: Polity[];
}

@Component({
  selector: 'app-add-polity-to-history',
  templateUrl: './add-polity-to-history.component.html',
  styleUrls: ['./add-polity-to-history.component.scss']
})
export class AddPolityToHistoryComponent implements OnInit {
  politySearchTerm = '';
  constructor(
    public dialogRef: MatDialogRef<AddPolityToHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddPolityToHistoryData) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  politySearchChanged(event): void {
    this.politySearchTerm = event.target.value;
  }

  isPolityVisible(starName: string): boolean {
    return starName.toLowerCase().includes(this.politySearchTerm.toLowerCase());
  }
}
