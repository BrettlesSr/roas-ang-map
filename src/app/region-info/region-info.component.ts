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

  constructor() { }

  @Input() regionInfo: Region;

  ngOnInit(): void {
  }

  get tradeIcons(): Icon[]{
    return [
      {
        description: 'Base trade volume',
        value: this.regionInfo.baseTradeValue,
        icon: 'https://i.imgur.com/OS3oc4N.png'
      },
      {
        description: 'Trade nodes',
        value: this.regionInfo.tradeNodes,
        icon: 'https://i.imgur.com/olKjOZM.png'
      },
      {
        description: 'Total trade volume',
        value: this.regionInfo.totalTradeValue,
        icon: 'https://i.imgur.com/Xe4p9er.png'
      },
    ];
  }

  get piracyIcons(): Icon[]{
    return [
      {
        description: 'Prism Concern activity level',
        value: this.regionInfo.prismConcern,
        icon: 'https://i.imgur.com/USowViC.png'
      },
      {
        description: 'Midgard Allthing activity level',
        value: this.regionInfo.midgardAthling,
        icon: 'https://i.imgur.com/3R9cKHw.png'
      },
      {
        description: 'MyCorp activity level',
        value: this.regionInfo.myCorp,
        icon: 'https://i.imgur.com/pOsmtRX.png'
      },
      {
        description: 'The Knights activity level',
        value: this.regionInfo.knights,
        icon: 'https://i.imgur.com/UhCly3C.png'
      },
      {
        description: 'The Pack activity level',
        value: this.regionInfo.pack,
        icon: 'https://i.imgur.com/6Mh6bdX.png'
      },
      {
        description: 'Freebooters activity level',
        value: this.regionInfo.freebooters,
        icon: 'https://i.imgur.com/vYSGAp9.png'
      },
    ].sort((a, b) => b.value - a.value);
  }

  get terrorIcons(): Icon[]{
    return [
      {
        description: 'Corrupt Reformers activity level',
        value: this.regionInfo.corruptReformists,
        icon: 'https://i.imgur.com/Kon6CDy.png'
      },
      {
        description: 'Autonomists activity level',
        value: this.regionInfo.autonomists,
        icon: 'https://i.imgur.com/Pqni6ef.png'
      },
      {
        description: 'Petitioners activity level',
        value: this.regionInfo.petitioners,
        icon: 'https://i.imgur.com/zTlwzdk.png'
      },
      {
        description: 'Black Hand activity level',
        value: this.regionInfo.blackHand,
        icon: 'https://i.imgur.com/jnZjiyG.png'
      },
      {
        description: 'Murder Apes activity level',
        value: this.regionInfo.murderApes,
        icon: 'https://i.imgur.com/ePF7i0W.png'
      },
      {
        description: 'Task Force Titan activity level',
        value: this.regionInfo.tfTitans,
        icon: 'https://i.imgur.com/YbBmApx.png'
      },
    ].sort((a, b) => b.value - a.value);
  }
}
