import { PiracyState } from '../enums/piracyState';

export class Region {
    name: string;
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;

    dominantSoVFaction: number;
    corruptReformists: number;
    autonomists: number;
    petitioners: number;
    blackHand: number;
    murderApes: number;
    tfTitans: number;

    piracyState: PiracyState;
    prismConcern: number;
    midgardAthling: number;
    myCorp: number;
    pack: number;
    knights: number;
    freebooters: number;
    stronghold: string;

    baseTradeValue: number;
    tradeNodes: number;
    totalTradeValue: number;
}
