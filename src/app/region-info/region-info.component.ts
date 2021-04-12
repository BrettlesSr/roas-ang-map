import { Component, Input, OnInit } from '@angular/core';
import { Region } from '../models/region';

export class Icon{
  icon: string;
  value: number;
  description: string;
  tooltip: string;
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
        icon: 'https://i.imgur.com/OS3oc4N.png',
        tooltip: 'Base number of freighters a sector can absorb'
      },
      {
        description: 'Trade nodes',
        value: this.regionInfo.tradeNodes,
        icon: 'https://i.imgur.com/olKjOZM.png',
        tooltip: 'Number of trade nodes in a sector: each increases effective volume by +100%'
      },
      {
        description: 'Total trade volume',
        value: this.regionInfo.totalTradeValue,
        icon: 'https://i.imgur.com/Xe4p9er.png',
        tooltip: 'Total number of freighters a typical Verge polity can send to this sector'
      },
    ];
  }

  get piracyIcons(): Icon[]{
    return [
      {
        description: 'Prism Concern activity level',
        value: this.regionInfo.prismConcern,
        icon: 'https://i.imgur.com/USowViC.png',
        tooltip : 'Well-armed pirates repurposing stolen alien technology'
      },
      {
        description: 'Midgard Allthing activity level',
        value: this.regionInfo.midgardAthling,
        icon: 'https://i.imgur.com/3R9cKHw.png',
        tooltip : 'Raiders who hail from the Verge\'s most infamous pirate kingdom'
      },
      {
        description: 'MyCorp activity level',
        value: this.regionInfo.myCorp,
        icon: 'https://i.imgur.com/pOsmtRX.png',
        tooltip : 'Operators backed by the disreputable hypercorp MyCorp'
      },
      {
        description: 'The Knights activity level',
        value: this.regionInfo.knights,
        icon: 'https://i.imgur.com/UhCly3C.png',
        tooltip : 'Smugglers loyal to the Pope who fled to the Verge after the Sack of Europe'
      },
      {
        description: 'The Pack activity level',
        value: this.regionInfo.pack,
        icon: 'https://i.imgur.com/6Mh6bdX.png',
        tooltip : 'Escaped bioroids funding revolutionary activity with organized crime'
      },
      {
        description: 'Freebooters activity level',
        value: this.regionInfo.freebooters,
        icon: 'https://i.imgur.com/vYSGAp9.png',
        tooltip : 'Generic pirates, ne\'er-do-wells, smugglers and privateers'
      },
    ].sort((a, b) => b.value - a.value);
  }

  get terrorIcons(): Icon[]{
    return [
      {
        description: 'Corrupt Reformers activity level',
        value: this.regionInfo.corruptReformists,
        icon: 'https://i.imgur.com/Kon6CDy.png',
        tooltip : 'Legitimized mafias and shady lobbying groups, united by pro-Verge sentiment'
      },
      {
        description: 'Autonomists activity level',
        value: this.regionInfo.autonomists,
        icon: 'https://i.imgur.com/Pqni6ef.png',
        tooltip : 'Isolationist pacifists formed from anti-authoritarian dissidents'
      },
      {
        description: 'Petitioners activity level',
        value: this.regionInfo.petitioners,
        icon: 'https://i.imgur.com/zTlwzdk.png',
        tooltip : 'Semi-insane cultists obsessed with the alien and paracausal'
      },
      {
        description: 'Black Hand activity level',
        value: this.regionInfo.blackHand,
        icon: 'https://i.imgur.com/jnZjiyG.png',
        tooltip : 'Well resourced, violent, Anti-Solarian terrorists'
      },
      {
        description: 'Murder Apes activity level',
        value: this.regionInfo.murderApes,
        icon: 'https://i.imgur.com/ePF7i0W.png',
        tooltip : 'Anti-alien militias that rabidly oppose the xeno and xenotech'
      },
      {
        description: 'Task Force Titan activity level',
        value: this.regionInfo.tfTitans,
        icon: 'https://i.imgur.com/YbBmApx.png',
        tooltip : 'UN Taskforce dedicated to opposing terrorism and piracy'
      },
    ].sort((a, b) => b.value - a.value);
  }
}
