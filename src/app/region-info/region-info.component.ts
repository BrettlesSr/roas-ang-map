import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { PiracyState } from '../enums/piracyState';
import { Region } from '../models/region';

export class Icon{
  icon: string;
  value: number;
  description: string;
}

@Component({
  selector: 'app-region-info',
  templateUrl: './region-info.component.html',
  styleUrls: ['./region-info.component.scss']
})
export class RegionInfoComponent implements OnInit {

  constructor(private http: HttpClient) { }

  @Input() regionInfo: Region;

  ngOnInit(): void {
  }

  get tradeIcons(): Icon[]{
    return [
      {
        description: 'Base trade volume',
        value: this.regionInfo.baseTradeValue,
        icon: ''
      },
      {
        description: 'Trade nodes',
        value: this.regionInfo.tradeNodes,
        icon: ''
      },
      {
        description: 'Total trade volume',
        value: this.regionInfo.totalTradeValue,
        icon: ''
      },
    ]
  }

  get piracyIcons(): Icon[]{
    return [
      {
        description: 'Prism Concern activity level',
        value: this.regionInfo.prismConcern,
        icon: ''
      },
      {
        description: 'Midgard Allthing activity level',
        value: this.regionInfo.midgardAthling,
        icon: ''
      },
      {
        description: 'MyCorp activity level',
        value: this.regionInfo.myCorp,
        icon: ''
      },
      {
        description: 'The Knights activity level',
        value: this.regionInfo.knights,
        icon: ''
      },
      {
        description: 'The Pack activity level',
        value: this.regionInfo.pack,
        icon: ''
      },
      {
        description: 'Freebooters activity level',
        value: this.regionInfo.freebooters,
        icon: ''
      },
    ].sort((a, b) => b.value - a.value);
  }

  get terrorIcons(): Icon[]{
    return [
      {
        description: 'Corrupt Reformers activity level',
        value: this.regionInfo.corruptReformists,
        icon: ''
      },
      {
        description: 'Autonomists activity level',
        value: this.regionInfo.autonomists,
        icon: ''
      },
      {
        description: 'Petitioners activity level',
        value: this.regionInfo.petitioners,
        icon: ''
      },
      {
        description: 'Black Hand activity level',
        value: this.regionInfo.blackHand,
        icon: ''
      },
      {
        description: 'Murder Apes activity level',
        value: this.regionInfo.murderApes,
        icon: ''
      },
      {
        description: 'Task Force Titan activity level',
        value: this.regionInfo.tfTitans,
        icon: ''
      },
    ].sort((a, b) => b.value - a.value);
  }
}
