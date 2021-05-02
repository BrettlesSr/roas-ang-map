import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PanZoomAPI, PanZoomConfig } from 'ngx-panzoom';
import { Subscription } from 'rxjs';
export interface SubMapModalData {
  subMapUrl: string;
  subMapDimension: number;
  subMapTitle: string;
}

@Component({
  selector: 'app-sub-map-modal',
  templateUrl: './sub-map-modal.component.html',
  styleUrls: ['./sub-map-modal.component.scss']
})
export class SubMapModalComponent implements OnInit {
  dragPosition = {x: 0, y: 0};
  panZoomConfig: PanZoomConfig = new PanZoomConfig();
  
  constructor(
    public dialogRef: MatDialogRef<SubMapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public subMapModalData: SubMapModalData) {
   }

  ngOnInit(): void {
    this.panZoomConfig.keepInBounds = false;
    this.panZoomConfig.zoomLevels = 7;
    this.panZoomConfig.neutralZoomLevel = 3;
    this.panZoomConfig.scalePerZoomLevel = 1.5;
    this.panZoomConfig.freeMouseWheel = false;
    this.panZoomConfig.invertMouseWheel = true;
    this.panZoomConfig.initialZoomLevel = 4;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
